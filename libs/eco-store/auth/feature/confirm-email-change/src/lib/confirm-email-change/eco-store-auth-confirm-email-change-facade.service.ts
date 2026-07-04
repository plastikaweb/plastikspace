import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormFacade, ConfirmEmailChangeData } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';

/**
 * @description Facade for the public email-change confirmation page. Reads the token from the URL,
 * confirms with the user's current password, then forces re-login.
 */
@Injectable({ providedIn: 'root' })
export class EcoStoreAuthConfirmEmailChangeFacadeService implements AuthFormFacade<
  Pick<ConfirmEmailChangeData, 'password'>
> {
  readonly #router = inject(Router);
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #notificationService = inject(StoreNotificationService);
  readonly #activityStore = inject(activityStore);

  readonly token = computed(() => new URL(window.location.href).searchParams.get('token') || '');
  readonly isLoading = this.#profileStore.isLoading;
  readonly formConfig = inject(FORM_TOKEN) as FormConfig<Pick<ConfirmEmailChangeData, 'password'>>;

  constructor() {
    // Clears the app-initializer activity overlay, mirroring the reset-password facade.
    this.#activityStore.setActivity(this.isLoading(), 'auth.confirmEmailChange.loading');
  }

  /**
   * @description Submits the confirmation: confirm email change, then re-login on success.
   * @param {Partial<Pick<ConfirmEmailChangeData, 'password'>>} data The current password.
   * @returns {Promise<void>} Resolves when handled.
   */
  async onSubmit(data: Partial<Pick<ConfirmEmailChangeData, 'password'>>): Promise<void> {
    if (this.token() && data.password) {
      const success = await this.#profileStore.confirmEmailChange({
        token: this.token(),
        password: data.password,
      });
      if (success) {
        // The email change invalidates the current session token — clear it before
        // sending the user to log in again with the new address.
        this.#profileStore.logout();
        this.#notificationService.create('auth.confirmEmailChange.success', 'SUCCESS');
        this.#router.navigate(['/accedir']);
      } else {
        this.#notificationService.create('auth.confirmEmailChange.error', 'ERROR');
      }
    } else {
      this.#notificationService.create('auth.confirmEmailChange.error', 'ERROR');
    }
  }
}
