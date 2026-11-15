import { LiveAnnouncer } from '@angular/cdk/a11y';
import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AUTH_LOGIN_ERRORS,
  AuthFormFacade,
  AuthFormMessage,
  LoginData,
} from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import {
  ECO_ADMIN_ALLOWED_ROLES,
  ecoAdminHomeFor,
  EcoAdminRole,
  isEcoAdminRole,
  resolveReturnUrl,
} from '@plastik/eco-admin/auth/data-access';

/**
 * Why a login attempt ended without a session, as the screen says it. `wrong` and `secondStep` are the
 * ones every login screen shares (`AUTH_LOGIN_ERRORS`); the panel adds one of its own:
 *
 * - `member`: the credentials are right but the account is a storefront member's. A warning, not an
 *   error. Its keys are written out in full because the i18n validator cannot follow a key built at
 *   run time.
 */
export const ECO_ADMIN_LOGIN_ERRORS = {
  ...AUTH_LOGIN_ERRORS,
  member: {
    type: 'WARNING',
    title: 'auth.login.error.member.title',
    body: 'auth.login.error.member.body',
  },
} as const satisfies Record<string, AuthFormMessage>;

/**
 * Whose session was opened, which decides where the administrator is taken and what the screen says
 * meanwhile: `global` to the list of cooperatives, `tenant` to the dashboard of their own.
 */
export const ECO_ADMIN_LOGIN_SUCCESSES = {
  global: {
    type: 'SUCCESS',
    title: 'auth.login.success.title',
    body: 'auth.login.success.redirectGlobal',
  },
  tenant: {
    type: 'SUCCESS',
    title: 'auth.login.success.title',
    body: 'auth.login.success.redirectTenant',
  },
} as const satisfies Record<string, AuthFormMessage>;

/**
 * @description Facade service for the Eco Admin Auth Login feature, built like the storefront's:
 * the route provides it under `AUTH_FORM_FACADE` and gives it the form under `FORM_TOKEN`.
 *
 * It opens a session for administrators only, says on the screen why an attempt failed (never in a
 * toast) and takes the administrator home. The route may keep one instance across visits, which is
 * why the shared auth screen calls `clearError()` when it goes away.
 */
@Injectable()
export class EcoAdminAuthLoginFacadeService implements AuthFormFacade<LoginData> {
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #liveAnnouncer = inject(LiveAnnouncer);
  readonly #translate = inject(TranslateService);
  readonly #isLoading = signal(false);
  readonly #error = signal<AuthFormMessage | null>(null);
  readonly #success = signal<AuthFormMessage | null>(null);

  readonly formConfig = inject(FORM_TOKEN) as FormConfig<LoginData>;
  readonly isLoading = this.#isLoading.asReadonly();
  readonly error = this.#error.asReadonly();
  readonly success = this.#success.asReadonly();

  /**
   * @description Handles the submission of the login form. Never rejects, and ignores an attempt
   * made while another one runs or after a session was opened.
   * @param {LoginData} credentials The address and the password as typed.
   * @returns {Promise<void>} A promise that resolves when the attempt is over; how it ended is in `error()` or `success()`.
   */
  async onSubmit(credentials: LoginData): Promise<void> {
    if (this.#isLoading() || this.#success()) {
      return;
    }

    const role = await this.#openSession(credentials);

    if (!role) {
      return;
    }

    const success =
      role === 'GLOBAL_ADMIN' ? ECO_ADMIN_LOGIN_SUCCESSES.global : ECO_ADMIN_LOGIN_SUCCESSES.tenant;

    this.#success.set(success);
    // The screen is destroyed by the navigation below, so a live region in it would be cut short.
    // The announcer lives in the document and outlasts the route.
    void this.#liveAnnouncer.announce(
      `${this.#translate.instant(success.title)} ${this.#translate.instant(success.body)}`,
      'polite'
    );

    try {
      await this.#router.navigateByUrl(
        resolveReturnUrl(this.#route.snapshot.queryParamMap.get('returnUrl'), ecoAdminHomeFor(role))
      );
    } finally {
      // This instance outlives the screen: the next visit must not find a session announced.
      this.#success.set(null);
    }
  }

  /**
   * @description Hides the reason of the last failed attempt. Called as soon as a field is edited and when the screen goes away.
   *
   * The reason is also taken away when a new attempt starts and comes back with its answer: that
   * is what makes the card shake again (see `eco-shake-on-error` in `libs/eco/styles`).
   */
  clearError(): void {
    if (!this.#isLoading()) {
      this.#error.set(null);
    }
  }

  /**
   * Asks the store for a session of an administrator.
   * @param {LoginData} credentials The address and the password as typed.
   * @returns {Promise<EcoAdminRole | null>} The role of the administrator, or null with the reason in `error()`.
   */
  async #openSession(credentials: LoginData): Promise<EcoAdminRole | null> {
    const email = credentials.email.trim();

    if (!email || !credentials.password) {
      // Nothing to check against the server, and no different text for it either.
      return this.#fail(ECO_ADMIN_LOGIN_ERRORS.wrong);
    }

    this.#error.set(null);
    this.#isLoading.set(true);

    try {
      const outcome = await this.#profileStore.login(
        { email, password: credentials.password },
        { allowedRoles: ECO_ADMIN_ALLOWED_ROLES, notifyOnFailure: false }
      );

      switch (outcome) {
        case 'authenticated':
          return this.#adminRole();
        case 'role-rejected':
          return this.#fail(ECO_ADMIN_LOGIN_ERRORS.member);
        case 'mfa-required':
          // The store keeps the pending login for a screen that can finish it. This one cannot.
          this.#profileStore.cancelLoginChallenge();

          return this.#fail(ECO_ADMIN_LOGIN_ERRORS.secondStep);
        default:
          return this.#fail(ECO_ADMIN_LOGIN_ERRORS.wrong);
      }
    } catch {
      return this.#fail(ECO_ADMIN_LOGIN_ERRORS.wrong);
    } finally {
      this.#isLoading.set(false);
    }
  }

  #adminRole(): EcoAdminRole | null {
    const role = this.#profileStore.user()?.role;

    if (!isEcoAdminRole(role)) {
      // `allowedRoles` makes this unreachable; it is here so a session of another role can never stay open.
      this.#profileStore.logout();

      return this.#fail(ECO_ADMIN_LOGIN_ERRORS.member);
    }

    return role;
  }

  #fail(error: AuthFormMessage): null {
    this.#error.set(error);

    return null;
  }
}
