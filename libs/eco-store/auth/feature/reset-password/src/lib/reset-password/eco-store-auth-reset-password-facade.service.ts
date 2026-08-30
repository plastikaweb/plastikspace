import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormFacade, ResetPasswordData } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';

/**
 * @description Facade service for the Eco Store Auth Reset Password feature.
 * Orchestrates the password reset process, including token retrieval and backend communication.
 */
@Injectable({
  providedIn: 'root',
})
export class EcoStoreAuthResetPasswordFacadeService implements AuthFormFacade<ResetPasswordData> {
  readonly #router = inject(Router);
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #activityStore = inject(activityStore);
  readonly token = computed(() => {
    const url = new URL(window.location.href);

    return url.searchParams.get('token') || '';
  });
  readonly isLoading = this.#profileStore.isLoading;
  readonly notificationService = inject(StoreNotificationService);

  readonly formConfig = inject(FORM_TOKEN) as FormConfig<ResetPasswordData>;

  constructor() {
    this.#activityStore.setActivity(this.isLoading(), 'auth.resetPassword.loading');
  }

  /**
   * @description Handles the submission of the password reset form.
   * @param {Partial<ResetPasswordData>} data The form data containing the new password and confirmation.
   * @returns {Promise<void>} A promise that resolves when the process is complete.
   */
  async onSubmit(data: Partial<ResetPasswordData>): Promise<void> {
    if (this.token() && data.password && data.confirmPassword) {
      const success = await this.#profileStore.resetPassword({
        token: this.token(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (success) {
        this.notificationService.create('auth.resetPassword.success', 'SUCCESS');
        this.#router.navigate(['/accedir']);
      } else {
        this.notificationService.create('auth.resetPassword.error', 'ERROR');
        this.#router.navigate(['/recuperar-contrasenya']);
      }
    } else {
      this.notificationService.create('auth.resetPassword.error', 'ERROR');
    }
  }
}
