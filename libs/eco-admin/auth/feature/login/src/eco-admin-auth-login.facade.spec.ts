import { TestBed } from '@angular/core/testing';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { PocketBaseUser, PocketBaseUserRoles } from '@plastik/core/entities';

import { EcoAdminAuthLoginFacade } from './eco-admin-auth-login.facade';

describe('EcoAdminAuthLoginFacade', () => {
  const credentials = { email: 'admin@example.test', password: 'test-password' };
  let facade: EcoAdminAuthLoginFacade;

  /**
   * Makes the store double answer a login the way the real store does.
   * @param {string} outcome What the store reports.
   * @param {PocketBaseUserRoles | null} role The role of the user the store ends up holding.
   */
  function storeAnswers(outcome: string, role: PocketBaseUserRoles | null = null): void {
    mockPocketBaseUserProfileStore.login.mockImplementation(async () => {
      mockPocketBaseUserProfileStore.user.set(
        role === null ? null : ({ id: 'user-1', role } as PocketBaseUser)
      );

      return outcome;
    });
  }

  beforeEach(() => {
    mockPocketBaseUserProfileStore.login.mockReset();
    mockPocketBaseUserProfileStore.logout.mockReset();
    mockPocketBaseUserProfileStore.cancelLoginChallenge.mockReset();
    mockPocketBaseUserProfileStore.user.set(null);

    TestBed.configureTestingModule({
      providers: [
        EcoAdminAuthLoginFacade,
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
      ],
    });
    facade = TestBed.inject(EcoAdminAuthLoginFacade);
  });

  it('starts idle, with nothing to report', () => {
    expect(facade.status()).toBe('idle');
    expect(facade.error()).toBeNull();
    expect(facade.role()).toBeNull();
    expect(facade.shake()).toBeNull();
  });

  it('asks the store for administrators only, and silences its toast', async () => {
    storeAnswers('authenticated', 'TENANT_ADMIN');

    await facade.submit({ email: '  admin@example.test ', password: ' test-password ' });

    expect(mockPocketBaseUserProfileStore.login).toHaveBeenCalledWith(
      { email: 'admin@example.test', password: ' test-password ' },
      { allowedRoles: ['TENANT_ADMIN', 'GLOBAL_ADMIN'], notifyOnFailure: false }
    );
  });

  it.each<PocketBaseUserRoles>(['TENANT_ADMIN', 'GLOBAL_ADMIN'])(
    'reports the session of a %s',
    async role => {
      storeAnswers('authenticated', role);

      await expect(facade.submit(credentials)).resolves.toBe('authenticated');
      expect(facade.status()).toBe('success');
      expect(facade.role()).toBe(role);
      expect(facade.error()).toBeNull();
    }
  );

  it('is busy while the store works', async () => {
    let finish: (outcome: string) => void = () => undefined;

    mockPocketBaseUserProfileStore.login.mockReturnValue(
      new Promise<string>(resolve => (finish = resolve))
    );

    const attempt = facade.submit(credentials);

    expect(facade.status()).toBe('submitting');

    finish('failed');
    await attempt;

    expect(facade.status()).toBe('idle');
  });

  it('ignores a second attempt while the first one runs', async () => {
    let finish: (outcome: string) => void = () => undefined;

    mockPocketBaseUserProfileStore.login.mockReturnValue(
      new Promise<string>(resolve => (finish = resolve))
    );

    const first = facade.submit(credentials);

    await expect(facade.submit(credentials)).resolves.toBe('ignored');

    finish('failed');
    await first;

    expect(mockPocketBaseUserProfileStore.login).toHaveBeenCalledTimes(1);
  });

  it('ignores an attempt after a session was opened', async () => {
    storeAnswers('authenticated', 'TENANT_ADMIN');
    await facade.submit(credentials);

    await expect(facade.submit(credentials)).resolves.toBe('ignored');
    expect(mockPocketBaseUserProfileStore.login).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['failed', 'wrong'],
    ['role-rejected', 'member'],
    ['mfa-required', 'secondStep'],
  ])('turns the outcome %s into the error %s', async (outcome, error) => {
    storeAnswers(outcome);

    await expect(facade.submit(credentials)).resolves.toBe('rejected');
    expect(facade.error()).toBe(error);
    expect(facade.status()).toBe('idle');
    expect(facade.role()).toBeNull();
  });

  it('drops the pending login when the account asks for a second step', async () => {
    storeAnswers('mfa-required');

    await facade.submit(credentials);

    expect(mockPocketBaseUserProfileStore.cancelLoginChallenge).toHaveBeenCalledTimes(1);
  });

  it('reports a store that throws as wrong credentials', async () => {
    mockPocketBaseUserProfileStore.login.mockRejectedValue(new Error('network'));

    await expect(facade.submit(credentials)).resolves.toBe('rejected');
    expect(facade.error()).toBe('wrong');
    expect(facade.status()).toBe('idle');
  });

  it('closes a session whose role is not an administrator', async () => {
    storeAnswers('authenticated', 'PARTNER');

    await expect(facade.submit(credentials)).resolves.toBe('rejected');
    expect(mockPocketBaseUserProfileStore.logout).toHaveBeenCalledTimes(1);
    expect(facade.error()).toBe('member');
  });

  it.each([
    ['no address', { email: '', password: 'test-password' }],
    ['a blank address', { email: '   ', password: 'test-password' }],
    ['no password', { email: 'admin@example.test', password: '' }],
  ])('rejects %s without asking the server', async (_label, incomplete) => {
    await expect(facade.submit(incomplete)).resolves.toBe('rejected');
    expect(facade.error()).toBe('wrong');
    expect(mockPocketBaseUserProfileStore.login).not.toHaveBeenCalled();
  });

  it('alternates the shake on every failure, so the animation restarts', async () => {
    storeAnswers('failed');

    await facade.submit(credentials);
    expect(facade.shake()).toBe('odd');

    await facade.submit(credentials);
    expect(facade.shake()).toBe('even');

    await facade.submit(credentials);
    expect(facade.shake()).toBe('odd');
  });

  it('hides the error when asked, and the shake with it', async () => {
    storeAnswers('failed');
    await facade.submit(credentials);

    facade.clearResult();

    expect(facade.error()).toBeNull();
    expect(facade.shake()).toBeNull();
  });

  it('clears the previous error as soon as a new attempt starts', async () => {
    storeAnswers('failed');
    await facade.submit(credentials);

    let finish: (outcome: string) => void = () => undefined;

    mockPocketBaseUserProfileStore.login.mockReturnValue(
      new Promise<string>(resolve => (finish = resolve))
    );

    const attempt = facade.submit(credentials);

    expect(facade.error()).toBeNull();

    finish('failed');
    await attempt;
  });
});
