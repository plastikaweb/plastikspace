import { effect, inject, Injectable } from '@angular/core';
import { PocketBaseResetPasswordFacadeService } from '@plastik/auth/pocketbase/data-access';
import { activityStore } from '@plastik/shared/activity/data-access';

/**
 * @description Facade service for the Eco Store Auth Reset Password feature.
 *
 * The reset itself is the shared one (`PocketBaseResetPasswordFacadeService`), which says on the
 * screen how the attempt ended; the storefront only adds its activity bar.
 */
@Injectable({
  providedIn: 'root',
})
export class EcoStoreAuthResetPasswordFacadeService extends PocketBaseResetPasswordFacadeService {
  readonly #activityStore = inject(activityStore);

  constructor() {
    super();

    effect(() => {
      this.#activityStore.setActivity(this.isLoading(), 'auth.resetPassword.loading');
    });
  }
}
