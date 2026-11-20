import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AUTH_RESET_PASSWORD_MESSAGES, ResetPasswordData } from '@plastik/auth/entities';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';

import { PocketBaseResetPasswordFacadeService } from './pocketbase-reset-password-facade.service';
import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';
import { mockPocketBaseUserProfileStore } from './pocketbase-user-profile.store.mock';

describe('PocketBaseResetPasswordFacadeService', () => {
  const passwords = { password: 'test-new-password', confirmPassword: 'test-new-password' };
  const formConfig = { getConfig: () => [] } as FormConfig<ResetPasswordData>;
  let facade: PocketBaseResetPasswordFacadeService;

  /**
   * Builds the facade the way the route does.
   * @param {string} [token] The value of the `token` query parameter the visitor arrives with.
   */
  async function create(token?: string): Promise<void> {
    if (token !== undefined) {
      await TestBed.inject(Router).navigateByUrl(`/?token=${encodeURIComponent(token)}`);
    }

    facade = TestBed.inject(PocketBaseResetPasswordFacadeService);
  }

  beforeEach(() => {
    mockPocketBaseUserProfileStore.resetPassword.mockReset();
    mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(true);
    mockPocketBaseUserProfileStore.isLoading.set(false);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        PocketBaseResetPasswordFacadeService,
        { provide: FORM_TOKEN, useValue: formConfig },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
      ],
    });
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.isLoading.set(false);
  });

  describe('with the link of the email', () => {
    beforeEach(() => create('test-token'));

    it('starts with nothing to report', () => {
      expect(facade.formConfig).toBe(formConfig);
      expect(facade.isLoading()).toBe(false);
      expect(facade.error()).toBeNull();
      expect(facade.success()).toBeNull();
      expect(facade.canSubmit()).toBe(true);
    });

    it('sends the token of the address with the passwords as typed', async () => {
      await facade.onSubmit(passwords);

      expect(mockPocketBaseUserProfileStore.resetPassword).toHaveBeenCalledWith({
        token: 'test-token',
        ...passwords,
      });
    });

    it('says on the screen that the password was changed', async () => {
      await facade.onSubmit(passwords);

      expect(facade.success()).toBe(AUTH_RESET_PASSWORD_MESSAGES.done);
      expect(facade.error()).toBeNull();
    });

    it('has nothing left to send once the password was changed', async () => {
      await facade.onSubmit(passwords);

      expect(facade.canSubmit()).toBe(false);
    });

    it('has nothing left to send once the link was refused', async () => {
      mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(false);

      await facade.onSubmit(passwords);

      expect(facade.canSubmit()).toBe(false);
    });

    it('says on the screen that the link no longer works when the store refuses it', async () => {
      mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(false);

      await facade.onSubmit(passwords);

      expect(facade.error()).toBe(AUTH_RESET_PASSWORD_MESSAGES.expired);
      expect(facade.success()).toBeNull();
    });

    it('says the same when the store breaks, without rejecting', async () => {
      mockPocketBaseUserProfileStore.resetPassword.mockRejectedValue(new Error('network'));

      await expect(facade.onSubmit(passwords)).resolves.toBeUndefined();

      expect(facade.error()).toBe(AUTH_RESET_PASSWORD_MESSAGES.expired);
    });

    it.each([{ password: 'test-new-password' }, { confirmPassword: 'test-new-password' }, {}])(
      'does not ask the store with a password missing: %o',
      async incomplete => {
        await facade.onSubmit(incomplete);

        expect(mockPocketBaseUserProfileStore.resetPassword).not.toHaveBeenCalled();
        expect(facade.error()).toBeNull();
      }
    );

    it('ignores an attempt made while another one runs', async () => {
      mockPocketBaseUserProfileStore.isLoading.set(true);

      await facade.onSubmit(passwords);

      expect(mockPocketBaseUserProfileStore.resetPassword).not.toHaveBeenCalled();
    });

    it('ignores an attempt made after the password was changed', async () => {
      await facade.onSubmit(passwords);
      mockPocketBaseUserProfileStore.resetPassword.mockClear();

      await facade.onSubmit(passwords);

      expect(mockPocketBaseUserProfileStore.resetPassword).not.toHaveBeenCalled();
    });

    it('ignores an attempt made after the link was refused, and keeps the reason', async () => {
      mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(false);
      await facade.onSubmit(passwords);
      mockPocketBaseUserProfileStore.resetPassword.mockClear();

      await facade.onSubmit(passwords);

      expect(mockPocketBaseUserProfileStore.resetPassword).not.toHaveBeenCalled();
      expect(facade.error()).toBe(AUTH_RESET_PASSWORD_MESSAGES.expired);
    });

    it('can be sent again once a refused attempt was forgotten', async () => {
      mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(false);
      await facade.onSubmit(passwords);

      facade.clearError();

      expect(facade.canSubmit()).toBe(true);
    });

    it('forgets a failed attempt when asked to', async () => {
      mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(false);
      await facade.onSubmit(passwords);

      facade.clearError();

      expect(facade.error()).toBeNull();
    });

    it('forgets a changed password when asked to, so the next visit starts clean', async () => {
      await facade.onSubmit(passwords);

      facade.clearError();

      expect(facade.success()).toBeNull();
      expect(facade.error()).toBeNull();
    });

    it('keeps the reason while an attempt runs', async () => {
      mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(false);
      await facade.onSubmit(passwords);
      mockPocketBaseUserProfileStore.isLoading.set(true);

      facade.clearError();

      expect(facade.error()).toBe(AUTH_RESET_PASSWORD_MESSAGES.expired);
    });
  });

  describe('with an address that carries no token', () => {
    beforeEach(() => create());

    it('says from the start that the link does not work, and that there is nothing to send', () => {
      expect(facade.error()).toBe(AUTH_RESET_PASSWORD_MESSAGES.expired);
      expect(facade.canSubmit()).toBe(false);
    });

    it('does not ask the store', async () => {
      await facade.onSubmit(passwords);

      expect(mockPocketBaseUserProfileStore.resetPassword).not.toHaveBeenCalled();
    });

    it('keeps saying it when asked to forget', () => {
      facade.clearError();

      expect(facade.error()).toBe(AUTH_RESET_PASSWORD_MESSAGES.expired);
    });
  });

  it('follows the token when the address changes', async () => {
    await create();

    expect(facade.canSubmit()).toBe(false);

    await TestBed.inject(Router).navigateByUrl('/?token=test-later-token');

    expect(facade.canSubmit()).toBe(true);

    await facade.onSubmit(passwords);

    expect(mockPocketBaseUserProfileStore.resetPassword).toHaveBeenCalledWith({
      token: 'test-later-token',
      ...passwords,
    });
  });
});
