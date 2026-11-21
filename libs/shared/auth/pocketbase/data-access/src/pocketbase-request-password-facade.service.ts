import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormFacade, RequestPasswordData } from '@plastik/auth/entities';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';

import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';

/**
 * The route of the screen that says the email is on its way. Every app that asks for a password
 * reset through this facade serves it.
 */
export const POCKETBASE_REQUEST_PASSWORD_SENT_URL = '/recuperar-contrasenya-enviada';

/**
 * @description Facade of the screen that asks for the email to set a new password. A route provides
 * it under `AUTH_FORM_FACADE` and gives it the form under `FORM_TOKEN`.
 *
 * It always ends on the "email sent" screen, whether the address has an account or not and whether the
 * request failed or not, so the screen never tells which addresses exist.
 */
@Injectable()
export class PocketBaseRequestPasswordFacadeService implements AuthFormFacade<RequestPasswordData> {
  readonly #router = inject(Router);
  readonly #profileStore = inject(pocketBaseUserProfileStore);

  readonly formConfig = inject(FORM_TOKEN) as FormConfig<RequestPasswordData>;
  readonly isLoading = this.#profileStore.isLoading;

  /**
   * @description Handles the submission of the form. Never rejects, and ignores a request made while another one runs.
   * @param {RequestPasswordData} request The address as typed.
   * @returns {Promise<void>} A promise that resolves once the "email sent" screen is on.
   */
  async onSubmit(request: RequestPasswordData): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    try {
      await this.#profileStore.requestPassword(request);
    } catch {
      // Nothing to say: the next screen is the same for an address with no account.
    } finally {
      await this.#router.navigateByUrl(POCKETBASE_REQUEST_PASSWORD_SENT_URL);
    }
  }
}
