import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  AUTH_RESET_PASSWORD_MESSAGES,
  AuthFormFacade,
  AuthFormMessage,
  ResetPasswordData,
} from '@plastik/auth/entities';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { map } from 'rxjs';

import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';

/**
 * @description Facade of the screen that sets a new password with the link of the email. A route
 * provides it under `AUTH_FORM_FACADE` and gives it the form under `FORM_TOKEN`.
 *
 * It says on the screen how the attempt ended (never in a toast) and stays there: what it says
 * carries the link to the next step. The token is the `token` query parameter of the address.
 */
@Injectable()
export class PocketBaseResetPasswordFacadeService implements AuthFormFacade<ResetPasswordData> {
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  // A service sees the root route, and the query parameters are the same along the whole route tree.
  readonly #token = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map(params => params.get('token') ?? '')),
    { initialValue: '' }
  );
  readonly #error = signal<AuthFormMessage | null>(null);
  readonly #success = signal<AuthFormMessage | null>(null);

  readonly formConfig = inject(FORM_TOKEN) as FormConfig<ResetPasswordData>;
  readonly isLoading = this.#profileStore.isLoading;
  readonly success = this.#success.asReadonly();
  /**
   * Why there is no new password. An address with no token says so from the start, and nothing
   * typed on this screen can mend it.
   */
  readonly error = computed<AuthFormMessage | null>(() => {
    if (this.#success()) {
      return null;
    }

    return this.#error() ?? (this.#token() ? null : AUTH_RESET_PASSWORD_MESSAGES.expired);
  });
  /**
   * False once the flow is over: the password was changed, the link was refused, or the address came
   * with no token. The screen then shows how it ended and no form. A link that was refused once is
   * refused again, so sending the same form a second time would only repeat the answer.
   */
  readonly canSubmit = computed(() => !this.#success() && !this.error());

  /**
   * @description Handles the submission of the form. Never rejects, and ignores an attempt made
   * while another one runs, after the flow is over, or with no token to send.
   * @param {Partial<ResetPasswordData>} passwords The new password, typed twice.
   * @returns {Promise<void>} A promise that resolves when the attempt is over; how it ended is in `error()` or `success()`.
   */
  async onSubmit(passwords: Partial<ResetPasswordData>): Promise<void> {
    const token = this.#token();
    const { password, confirmPassword } = passwords;

    if (this.isLoading() || !this.canSubmit() || !token || !password || !confirmPassword) {
      return;
    }

    const isChanged = await this.#changePassword({ token, password, confirmPassword });

    if (isChanged) {
      this.#success.set(AUTH_RESET_PASSWORD_MESSAGES.done);
    } else {
      this.#error.set(AUTH_RESET_PASSWORD_MESSAGES.expired);
    }
  }

  /**
   * @description Forgets how the last attempt ended. Called when the screen goes away, so that an
   * instance the route keeps does not greet the next visit with it.
   */
  clearError(): void {
    if (!this.isLoading()) {
      this.#error.set(null);
      this.#success.set(null);
    }
  }

  async #changePassword(reset: ResetPasswordData): Promise<boolean> {
    try {
      return await this.#profileStore.resetPassword(reset);
    } catch {
      return false;
    }
  }
}
