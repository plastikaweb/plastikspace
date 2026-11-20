import { effect, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AUTH_LOGIN_ERRORS,
  AuthFormFacade,
  AuthFormMessage,
  LoginData,
} from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { activityStore } from '@plastik/shared/activity/data-access';

/**
 * @description Facade service for the Eco Store Auth Login feature.
 * Orchestrates the login process and tenant-specific authentication checks.
 *
 * It says on the screen why an attempt failed (never in a toast), with the texts every login screen
 * shares. It lives in the root injector, so it outlives the screen: the shared auth screen calls
 * `clearError()` when it goes away.
 */
@Injectable({
  providedIn: 'root',
})
export class EcoStoreAuthLoginFacadeService implements AuthFormFacade<LoginData> {
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #tenantStore = inject(ecoStoreTenantStore);
  readonly #activityStore = inject(activityStore);
  readonly #error = signal<AuthFormMessage | null>(null);

  readonly isLoading = this.#profileStore.isLoading;
  readonly error = this.#error.asReadonly();

  readonly formConfig = inject(FORM_TOKEN) as FormConfig<LoginData>;

  constructor() {
    effect(() => {
      this.#activityStore.setActivity(this.isLoading(), 'auth.login.loading');
    });
  }

  /**
   * @description Handles the submission of the login form. Never rejects, and ignores an attempt made
   * while another one runs.
   * @param {LoginData} credentials The form data containing the user's email and password.
   * @returns {Promise<void>} A promise that resolves when the attempt is over; why it failed is in `error()`.
   */
  async onSubmit(credentials: LoginData): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    // Taken away here and set again with the answer: that is what makes the card shake on every
    // failed attempt (see `eco-shake-on-error` in `libs/eco/styles`).
    this.#error.set(null);

    const error = await this.#openSession(credentials);

    if (error) {
      this.#error.set(error);

      return;
    }

    await this.#router.navigateByUrl(this.#getSafeReturnUrl());
  }

  /**
   * @description Hides the reason of the last failed attempt. Called as soon as a field is edited and when the screen goes away.
   */
  clearError(): void {
    if (!this.isLoading()) {
      this.#error.set(null);
    }
  }

  /**
   * Asks the store for a session of a member of this tenant.
   * @param {LoginData} credentials The address and the password as typed.
   * @returns {Promise<AuthFormMessage | null>} Why there is no session, or null when there is one.
   */
  async #openSession(credentials: LoginData): Promise<AuthFormMessage | null> {
    try {
      const outcome = await this.#profileStore.login(credentials, { notifyOnFailure: false });

      if (outcome === 'mfa-required') {
        // The store keeps the pending login for a screen that can finish it. The storefront has none.
        this.#profileStore.cancelLoginChallenge();

        return AUTH_LOGIN_ERRORS.secondStep;
      }

      if (outcome !== 'authenticated' || !this.#profileStore.isAuthenticated()) {
        return AUTH_LOGIN_ERRORS.wrong;
      }
    } catch {
      return AUTH_LOGIN_ERRORS.wrong;
    }

    const tenantId = this.#tenantStore.tenant()?.id;
    const user = this.#profileStore.user();

    if (tenantId && user && user.tenant !== tenantId) {
      // An account of another cooperative. The same text as a wrong password, so the screen does not
      // tell which addresses exist elsewhere.
      this.#profileStore.logout();

      return AUTH_LOGIN_ERRORS.wrong;
    }

    return null;
  }

  // Only accept same-origin paths to prevent open-redirect via returnUrl.
  #getSafeReturnUrl(): string {
    const raw = this.#route.snapshot.queryParamMap.get('returnUrl');

    return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
  }
}
