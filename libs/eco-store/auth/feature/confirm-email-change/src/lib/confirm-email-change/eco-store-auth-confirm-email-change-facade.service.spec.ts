import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN } from '@plastik/core/entities';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { signal } from '@angular/core';
import { EcoStoreAuthConfirmEmailChangeFacadeService } from './eco-store-auth-confirm-email-change-facade.service';
import { confirmEmailChangeFormConfig } from './confirm-email-change-form.config';

describe('EcoStoreAuthConfirmEmailChangeFacadeService', () => {
  const confirmEmailChange = vi.fn();
  const logout = vi.fn();
  const navigate = vi.fn();
  const create = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * @description Configures TestBed and returns the facade under test.
   * @param {string} token The email-change token to place in the URL query string.
   * @returns {EcoStoreAuthConfirmEmailChangeFacadeService} The injected facade instance.
   */
  function setup(token: string) {
    history.replaceState(
      null,
      '',
      token ? `/confirmar-correu?token=${token}` : '/confirmar-correu'
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: AUTH_FORM_FACADE, useClass: EcoStoreAuthConfirmEmailChangeFacadeService },
        { provide: FORM_TOKEN, useFactory: confirmEmailChangeFormConfig },
        { provide: Router, useValue: { navigate } },
        { provide: StoreNotificationService, useValue: { create } },
        {
          provide: pocketBaseUserProfileStore,
          useValue: { isLoading: signal(false), confirmEmailChange, logout },
        },
      ],
    });

    return TestBed.inject(AUTH_FORM_FACADE) as EcoStoreAuthConfirmEmailChangeFacadeService;
  }

  it('on success: confirms with token+password, toasts success, navigates to /accedir', async () => {
    confirmEmailChange.mockResolvedValueOnce(true);
    const facade = setup('abc');

    await facade.onSubmit({ password: 'pw' });
    expect(confirmEmailChange).toHaveBeenCalledWith({ token: 'abc', password: 'pw' });
    expect(logout).toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith('auth.confirmEmailChange.success', 'SUCCESS');
    expect(navigate).toHaveBeenCalledWith(['/accedir']);
  });

  it('on failure: toasts error and does not navigate to /accedir', async () => {
    confirmEmailChange.mockResolvedValueOnce(false);
    const facade = setup('abc');

    await facade.onSubmit({ password: 'pw' });
    expect(logout).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith('auth.confirmEmailChange.error', 'ERROR');
    expect(navigate).not.toHaveBeenCalledWith(['/accedir']);
  });

  it('with no token: toasts error, no confirm call', async () => {
    const facade = setup('');

    await facade.onSubmit({ password: 'pw' });
    expect(confirmEmailChange).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith('auth.confirmEmailChange.error', 'ERROR');
  });
});
