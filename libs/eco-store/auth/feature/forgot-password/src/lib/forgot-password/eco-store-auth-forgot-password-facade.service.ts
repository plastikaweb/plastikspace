import { effect, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormFacade, RequestPasswordData } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { activityStore } from '@plastik/shared/activity/data-access';

/**
 * @description Facade service for the Eco Store Auth Forgot Password feature.
 * Orchestrates the password recovery request process.
 */
@Injectable({
  providedIn: 'root',
})
export class EcoStoreAuthForgotPasswordFacadeService implements AuthFormFacade<RequestPasswordData> {
  readonly #router = inject(Router);
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #activityStore = inject(activityStore);
  readonly isLoading = this.#profileStore.isLoading;

  readonly formConfig = inject(FORM_TOKEN) as FormConfig<RequestPasswordData>;

  constructor() {
    effect(() => {
      this.#activityStore.setActivity(this.isLoading(), 'auth.forgotPassword.loading');
    });
  }

  /**
   * @description Handles the submission of the forgot password form.
   * @param {RequestPasswordData} credentials The form data containing the user's email.
   * @returns {Promise<void>} A promise that resolves when the process is complete.
   */
  async onSubmit(credentials: RequestPasswordData): Promise<void> {
    try {
      await this.#profileStore.requestPassword(credentials);
    } catch {
      // we navigate even on error to prevent user enumeration
    } finally {
      await this.#router.navigate(['/recuperar-contrasenya-enviada']);
    }
  }
}
