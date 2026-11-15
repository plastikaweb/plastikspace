import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { requestPasswordFormConfig } from '@plastik/auth/config/util';
import {
  pocketBaseUserProfileStore,
  PocketBaseRequestPasswordFacadeService,
} from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { FORM_TOKEN } from '@plastik/core/entities';
import { activityStore } from '@plastik/shared/activity/data-access';

import { EcoStoreAuthForgotPasswordFacadeService } from './eco-store-auth-forgot-password-facade.service';

describe('EcoStoreAuthForgotPasswordFacadeService', () => {
  const setActivity = vi.fn();
  let facade: EcoStoreAuthForgotPasswordFacadeService;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockPocketBaseUserProfileStore.requestPassword.mockReset();
    mockPocketBaseUserProfileStore.requestPassword.mockResolvedValue(undefined);
    mockPocketBaseUserProfileStore.isLoading.set(false);
    setActivity.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: FORM_TOKEN, useValue: requestPasswordFormConfig() },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        { provide: activityStore, useValue: { setActivity } },
      ],
    });

    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    facade = TestBed.inject(EcoStoreAuthForgotPasswordFacadeService);
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.isLoading.set(false);
  });

  it('is the shared request with the activity bar of the storefront on top', () => {
    expect(facade).toBeInstanceOf(PocketBaseRequestPasswordFacadeService);
  });

  it('asks for the email and shows the "email sent" screen', async () => {
    await facade.onSubmit({ email: 'member@example.test' });

    expect(mockPocketBaseUserProfileStore.requestPassword).toHaveBeenCalledWith({
      email: 'member@example.test',
    });
    expect(navigateByUrl).toHaveBeenCalledWith('/recuperar-contrasenya-enviada');
  });

  it('tells the activity bar when a request runs', () => {
    TestBed.tick();

    expect(setActivity).toHaveBeenLastCalledWith(false, 'auth.forgotPassword.loading');

    mockPocketBaseUserProfileStore.isLoading.set(true);
    TestBed.tick();

    expect(setActivity).toHaveBeenLastCalledWith(true, 'auth.forgotPassword.loading');
  });
});
