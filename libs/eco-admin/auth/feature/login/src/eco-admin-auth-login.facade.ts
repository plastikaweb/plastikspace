import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginData } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import {
  ECO_ADMIN_ALLOWED_ROLES,
  EcoAdminRole,
  isEcoAdminRole,
} from '@plastik/eco-admin/auth/data-access';

export type EcoAdminLoginStatus = 'idle' | 'submitting' | 'success';

/**
 * Why a login attempt ended without a session.
 *
 * - `wrong`: the credentials were not accepted, or the request failed. One text for both, and the same
 *   whether the address exists or not.
 * - `member`: the credentials are right but the account is a storefront member's.
 * - `secondStep`: the account asks for the emailed code, which this screen cannot take yet.
 */
export type EcoAdminLoginError = 'wrong' | 'member' | 'secondStep';

/**
 * How one call to `submit` ended. `ignored` means another attempt was already running or done.
 */
export type EcoAdminLoginResult = 'authenticated' | 'rejected' | 'ignored';

/**
 * State of the login screen. Provided by the screen itself, so it starts clean on every visit.
 */
@Injectable()
export class EcoAdminAuthLoginFacade {
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #status = signal<EcoAdminLoginStatus>('idle');
  readonly #error = signal<EcoAdminLoginError | null>(null);
  readonly #failures = signal(0);
  readonly #role = signal<EcoAdminRole | null>(null);

  readonly status = this.#status.asReadonly();
  readonly error = this.#error.asReadonly();
  /**
   * The role of the administrator who just signed in. Null until an attempt succeeds.
   */
  readonly role = this.#role.asReadonly();
  /**
   * Which of two identical shake animations the card plays. It alternates on every failure, because
   * an animation only restarts when its name changes.
   */
  readonly shake = computed<'odd' | 'even' | null>(() => {
    if (!this.#error()) {
      return null;
    }

    return this.#failures() % 2 === 1 ? 'odd' : 'even';
  });

  /**
   * Tries to open a session. Never rejects.
   * @param {LoginData} credentials The address and the password as typed.
   * @returns {Promise<EcoAdminLoginResult>} How the attempt ended; the detail is in `error()` or `role()`.
   */
  async submit(credentials: LoginData): Promise<EcoAdminLoginResult> {
    if (this.#status() !== 'idle') {
      return 'ignored';
    }

    const email = credentials.email.trim();

    if (!email || !credentials.password) {
      // Nothing to check against the server, and no different text for it either.
      return this.#fail('wrong');
    }

    this.#error.set(null);
    this.#status.set('submitting');

    try {
      const outcome = await this.#profileStore.login(
        { email, password: credentials.password },
        { allowedRoles: ECO_ADMIN_ALLOWED_ROLES, notifyOnFailure: false }
      );

      switch (outcome) {
        case 'authenticated':
          return this.#succeed();
        case 'role-rejected':
          return this.#fail('member');
        case 'mfa-required':
          // The store keeps the pending login for a screen that can finish it. This one cannot.
          this.#profileStore.cancelLoginChallenge();

          return this.#fail('secondStep');
        default:
          return this.#fail('wrong');
      }
    } catch {
      return this.#fail('wrong');
    }
  }

  /**
   * Hides the result of the last attempt. Called as soon as the user edits a field.
   */
  clearResult(): void {
    if (this.#status() === 'idle') {
      this.#error.set(null);
    }
  }

  #succeed(): EcoAdminLoginResult {
    const role = this.#profileStore.user()?.role;

    if (!isEcoAdminRole(role)) {
      // `allowedRoles` makes this unreachable; it is here so a session of another role can never stay open.
      this.#profileStore.logout();

      return this.#fail('member');
    }

    this.#role.set(role);
    this.#status.set('success');

    return 'authenticated';
  }

  #fail(error: EcoAdminLoginError): EcoAdminLoginResult {
    this.#failures.update(count => count + 1);
    this.#error.set(error);
    this.#status.set('idle');

    return 'rejected';
  }
}
