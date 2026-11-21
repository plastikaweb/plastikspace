import { effect, inject, Injectable } from '@angular/core';
import { PocketBaseRequestPasswordFacadeService } from '@plastik/auth/pocketbase/data-access';
import { activityStore } from '@plastik/shared/activity/data-access';

/**
 * @description Facade service for the Eco Store Auth Forgot Password feature.
 *
 * The request itself is the shared one (`PocketBaseRequestPasswordFacadeService`); the storefront
 * only adds its activity bar.
 */
@Injectable({
  providedIn: 'root',
})
export class EcoStoreAuthForgotPasswordFacadeService extends PocketBaseRequestPasswordFacadeService {
  readonly #activityStore = inject(activityStore);

  constructor() {
    super();

    effect(() => {
      this.#activityStore.setActivity(this.isLoading(), 'auth.forgotPassword.loading');
    });
  }
}
