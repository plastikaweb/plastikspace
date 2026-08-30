import { effect, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFormFacade, LoginData } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { activityStore } from '@plastik/shared/activity/data-access';

/**
 * @description Facade service for the Eco Store Auth Login feature.
 * Orchestrates the login process and tenant-specific authentication checks.
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

  readonly isLoading = this.#profileStore.isLoading;

  readonly formConfig = inject(FORM_TOKEN) as FormConfig<LoginData>;
  readonly extraLinks = signal([
    { label: 'auth.register.title', route: '/registre' },
    { label: 'auth.recover.title', route: '/peticio-clau' },
  ]);

  constructor() {
    effect(() => {
      this.#activityStore.setActivity(this.isLoading(), 'auth.login.loading');
    });
  }

  /**
   * @description Handles the submission of the login form.
   * @param {LoginData} credentials The form data containing the user's email and password.
   * @returns {Promise<void>} A promise that resolves when the process is complete.
   */
  async onSubmit(credentials: LoginData): Promise<void> {
    await this.#profileStore.login(credentials);
    const tenantId = this.#tenantStore.tenant()?.id;
    const user = this.#profileStore.user();

    if (tenantId && user && user?.tenant !== tenantId) {
      this.#profileStore.logout();
      throw new Error('User does not belong to this tenant');
    }

    if (this.#profileStore.isAuthenticated()) {
      await this.#router.navigateByUrl(this.#getSafeReturnUrl());
    }
  }

  // Only accept same-origin paths to prevent open-redirect via returnUrl.
  #getSafeReturnUrl(): string {
    const raw = this.#route.snapshot.queryParamMap.get('returnUrl');

    return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
  }
}
