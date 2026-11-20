import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { resetPasswordFormConfig } from '@plastik/auth/config/util';
import { AUTH_RESET_PASSWORD_MESSAGES } from '@plastik/auth/entities';
import {
  pocketBaseUserProfileStore,
  PocketBaseResetPasswordFacadeService,
} from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { FORM_TOKEN } from '@plastik/core/entities';
import { activityStore } from '@plastik/shared/activity/data-access';

import { EcoStoreAuthResetPasswordFacadeService } from './eco-store-auth-reset-password-facade.service';

describe('EcoStoreAuthResetPasswordFacadeService', () => {
  const passwords = { password: 'test-new-password', confirmPassword: 'test-new-password' };
  const setActivity = vi.fn();
  let facade: EcoStoreAuthResetPasswordFacadeService;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    mockPocketBaseUserProfileStore.resetPassword.mockReset();
    mockPocketBaseUserProfileStore.isLoading.set(false);
    setActivity.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: FORM_TOKEN, useValue: resetPasswordFormConfig() },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        { provide: activityStore, useValue: { setActivity } },
      ],
    });

    const router = TestBed.inject(Router);

    await router.navigateByUrl('/?token=test-token');
    navigate = vi.spyOn(router, 'navigateByUrl');
    facade = TestBed.inject(EcoStoreAuthResetPasswordFacadeService);
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.isLoading.set(false);
  });

  it('is the shared reset with the activity bar of the storefront on top', () => {
    expect(facade).toBeInstanceOf(PocketBaseResetPasswordFacadeService);
  });

  it('says on the screen that the password was changed, and stays there', async () => {
    mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(true);

    await facade.onSubmit(passwords);

    expect(mockPocketBaseUserProfileStore.resetPassword).toHaveBeenCalledWith({
      token: 'test-token',
      ...passwords,
    });
    expect(facade.success()).toBe(AUTH_RESET_PASSWORD_MESSAGES.done);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('says on the screen that the link no longer works, and stays there', async () => {
    mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(false);

    await facade.onSubmit(passwords);

    expect(facade.error()).toBe(AUTH_RESET_PASSWORD_MESSAGES.expired);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('tells the activity bar when a reset runs', () => {
    TestBed.tick();

    expect(setActivity).toHaveBeenLastCalledWith(false, 'auth.resetPassword.loading');

    mockPocketBaseUserProfileStore.isLoading.set(true);
    TestBed.tick();

    expect(setActivity).toHaveBeenLastCalledWith(true, 'auth.resetPassword.loading');
  });
});
