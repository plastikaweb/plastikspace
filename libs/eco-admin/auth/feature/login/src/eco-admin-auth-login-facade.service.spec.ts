import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { loginFormConfig } from '@plastik/auth/config/util';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { FORM_TOKEN, PocketBaseUser, PocketBaseUserRoles } from '@plastik/core/entities';

import {
  ECO_ADMIN_LOGIN_ERRORS,
  ECO_ADMIN_LOGIN_SUCCESSES,
  EcoAdminAuthLoginFacadeService,
} from './eco-admin-auth-login-facade.service';

describe('EcoAdminAuthLoginFacadeService', () => {
  const credentials = { email: 'admin@example.test', password: 'test-password' };
  const formConfig = loginFormConfig();
  let facade: EcoAdminAuthLoginFacadeService;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;
  let announce: ReturnType<typeof vi.spyOn>;

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

  /**
   * Makes the store double hold its answer until the test lets it go.
   * @returns {(outcome: string) => void} What lets the answer go.
   */
  function storeWaits(): (outcome: string) => void {
    let finish: (outcome: string) => void = () => undefined;

    mockPocketBaseUserProfileStore.login.mockReturnValue(
      new Promise<string>(resolve => (finish = resolve))
    );

    return outcome => finish(outcome);
  }

  /**
   * Builds the facade the way the route does.
   * @param {string} [returnUrl] The value of the `returnUrl` query parameter the visitor arrives with.
   */
  async function create(returnUrl?: string): Promise<void> {
    const router = TestBed.inject(Router);

    if (returnUrl !== undefined) {
      await router.navigateByUrl(`/?returnUrl=${encodeURIComponent(returnUrl)}`);
    }

    navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    announce = vi.spyOn(TestBed.inject(LiveAnnouncer), 'announce').mockResolvedValue();
    facade = TestBed.inject(EcoAdminAuthLoginFacadeService);
  }

  beforeEach(() => {
    mockPocketBaseUserProfileStore.login.mockReset();
    mockPocketBaseUserProfileStore.logout.mockReset();
    mockPocketBaseUserProfileStore.cancelLoginChallenge.mockReset();
    mockPocketBaseUserProfileStore.user.set(null);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTranslateService(),
        EcoAdminAuthLoginFacadeService,
        { provide: FORM_TOKEN, useValue: formConfig },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
      ],
    });
  });

  describe('before an attempt', () => {
    beforeEach(() => create());

    it('starts with nothing to report', () => {
      expect(facade.isLoading()).toBe(false);
      expect(facade.error()).toBeNull();
      expect(facade.success()).toBeNull();
    });

    it('takes its form from the route', () => {
      expect(facade.formConfig).toBe(formConfig);
    });
  });

  describe('an attempt', () => {
    beforeEach(() => create());

    it('asks the store for administrators only, and silences its toast', async () => {
      storeAnswers('authenticated', 'TENANT_ADMIN');

      await facade.onSubmit({ email: '  admin@example.test ', password: ' test-password ' });

      expect(mockPocketBaseUserProfileStore.login).toHaveBeenCalledWith(
        { email: 'admin@example.test', password: ' test-password ' },
        { allowedRoles: ['TENANT_ADMIN', 'GLOBAL_ADMIN'], notifyOnFailure: false }
      );
    });

    it('is busy while the store works', async () => {
      const finish = storeWaits();
      const attempt = facade.onSubmit(credentials);

      expect(facade.isLoading()).toBe(true);

      finish('failed');
      await attempt;

      expect(facade.isLoading()).toBe(false);
    });

    it('ignores a second attempt while the first one runs', async () => {
      const finish = storeWaits();
      const first = facade.onSubmit(credentials);

      await facade.onSubmit(credentials);

      finish('failed');
      await first;

      expect(mockPocketBaseUserProfileStore.login).toHaveBeenCalledTimes(1);
    });

    it.each([
      ['failed', 'wrong'],
      ['role-rejected', 'member'],
      ['mfa-required', 'secondStep'],
    ] as const)(
      'turns the outcome %s into the error %s, and goes nowhere',
      async (outcome, error) => {
        storeAnswers(outcome);

        await expect(facade.onSubmit(credentials)).resolves.toBeUndefined();

        expect(facade.error()).toBe(ECO_ADMIN_LOGIN_ERRORS[error]);
        expect(facade.isLoading()).toBe(false);
        expect(facade.success()).toBeNull();
        expect(navigateByUrl).not.toHaveBeenCalled();
        expect(announce).not.toHaveBeenCalled();
      }
    );

    it('says a storefront account is a warning, and the rest errors', () => {
      expect(ECO_ADMIN_LOGIN_ERRORS.member.type).toBe('WARNING');
      expect(ECO_ADMIN_LOGIN_ERRORS.wrong.type).toBe('ERROR');
      expect(ECO_ADMIN_LOGIN_ERRORS.secondStep.type).toBe('ERROR');
    });

    it('drops the pending login when the account asks for a second step', async () => {
      storeAnswers('mfa-required');

      await facade.onSubmit(credentials);

      expect(mockPocketBaseUserProfileStore.cancelLoginChallenge).toHaveBeenCalledTimes(1);
    });

    it('reports a store that throws as wrong credentials', async () => {
      mockPocketBaseUserProfileStore.login.mockRejectedValue(new Error('network'));

      await expect(facade.onSubmit(credentials)).resolves.toBeUndefined();

      expect(facade.error()).toBe(ECO_ADMIN_LOGIN_ERRORS.wrong);
      expect(facade.isLoading()).toBe(false);
    });

    it('closes a session whose role is not an administrator', async () => {
      storeAnswers('authenticated', 'PARTNER');

      await facade.onSubmit(credentials);

      expect(mockPocketBaseUserProfileStore.logout).toHaveBeenCalledTimes(1);
      expect(facade.error()).toBe(ECO_ADMIN_LOGIN_ERRORS.member);
      expect(navigateByUrl).not.toHaveBeenCalled();
    });

    it.each([
      ['no address', { email: '', password: 'test-password' }],
      ['a blank address', { email: '   ', password: 'test-password' }],
      ['no password', { email: 'admin@example.test', password: '' }],
    ])('rejects %s without asking the server', async (_label, incomplete) => {
      await facade.onSubmit(incomplete);

      expect(facade.error()).toBe(ECO_ADMIN_LOGIN_ERRORS.wrong);
      expect(mockPocketBaseUserProfileStore.login).not.toHaveBeenCalled();
    });

    it('hides the error when asked', async () => {
      storeAnswers('failed');
      await facade.onSubmit(credentials);

      facade.clearError();

      expect(facade.error()).toBeNull();
    });

    it('clears the previous error as soon as a new attempt starts', async () => {
      storeAnswers('failed');
      await facade.onSubmit(credentials);

      const finish = storeWaits();
      const attempt = facade.onSubmit(credentials);

      expect(facade.error()).toBeNull();

      finish('failed');
      await attempt;
    });
  });

  describe('a session', () => {
    it.each<[PocketBaseUserRoles, 'tenant' | 'global', string, string]>([
      ['TENANT_ADMIN', 'tenant', '/tauler', 'auth.login.success.redirectTenant'],
      ['GLOBAL_ADMIN', 'global', '/cooperatives', 'auth.login.success.redirectGlobal'],
    ])('takes a %s home and announces it', async (role, success, home, text) => {
      await create();
      storeAnswers('authenticated', role);

      let arrive: (done: boolean) => void = () => undefined;

      navigateByUrl.mockReturnValue(new Promise<boolean>(resolve => (arrive = resolve)));

      const attempt = facade.onSubmit(credentials);

      await vi.waitFor(() => expect(navigateByUrl).toHaveBeenCalledWith(home));
      expect(facade.success()).toBe(ECO_ADMIN_LOGIN_SUCCESSES[success]);
      expect(facade.error()).toBeNull();
      expect(announce).toHaveBeenCalledWith(`auth.login.success.title ${text}`, 'polite');

      arrive(true);
      await attempt;
    });

    it('ignores an attempt made while the administrator is taken home', async () => {
      await create();
      storeAnswers('authenticated', 'TENANT_ADMIN');

      let arrive: (done: boolean) => void = () => undefined;

      navigateByUrl.mockReturnValue(new Promise<boolean>(resolve => (arrive = resolve)));

      const attempt = facade.onSubmit(credentials);

      await vi.waitFor(() => expect(navigateByUrl).toHaveBeenCalled());
      await facade.onSubmit(credentials);

      expect(mockPocketBaseUserProfileStore.login).toHaveBeenCalledTimes(1);

      arrive(true);
      await attempt;
    });

    it('is ready for the next visit once the administrator is home', async () => {
      await create();
      storeAnswers('authenticated', 'TENANT_ADMIN');

      await facade.onSubmit(credentials);

      // The route keeps this instance: a later visit to the screen must find it as new.
      expect(facade.success()).toBeNull();
      expect(facade.isLoading()).toBe(false);
    });

    it('goes back to the address the visitor asked for', async () => {
      await create('/socis?estat=actiu');
      storeAnswers('authenticated', 'TENANT_ADMIN');

      await facade.onSubmit(credentials);

      expect(navigateByUrl).toHaveBeenCalledWith('/socis?estat=actiu');
    });

    it.each(['//evil.example', 'https://evil.example/', '/accedir'])(
      'never follows the return address %s',
      async returnUrl => {
        await create(returnUrl);
        storeAnswers('authenticated', 'TENANT_ADMIN');

        await facade.onSubmit(credentials);

        expect(navigateByUrl).toHaveBeenCalledWith('/tauler');
      }
    );
  });
});
