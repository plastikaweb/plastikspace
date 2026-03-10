import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormFacade, LoginData } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { activityStore } from '@plastik/shared/activity/data-access';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreAuthLoginFacadeService implements AuthFormFacade<LoginData> {
  readonly #profileStore = inject(pocketBaseUserProfileStore);
  readonly #router = inject(Router);
  readonly #tenantStore = inject(ecoStoreTenantStore);
  readonly #activityStore = inject(activityStore);

  formConfig = inject(FORM_TOKEN) as FormConfig<LoginData>;
  extraLinks = signal([
    { label: 'auth.register.title', route: '/registre' },
    { label: 'auth.recover.title', route: '/peticio-clau' },
  ]);

  constructor() {
    effect(() => {
      this.#activityStore.setActivity(this.#profileStore.isLoading(), 'auth.login.loading');
    });
  }

  async onSubmit(credentials: LoginData): Promise<void> {
    await this.#profileStore.login(credentials);
    const tenantId = this.#tenantStore.tenant()?.id;
    const user = this.#profileStore.user();

    if (tenantId && user && user?.tenant !== tenantId) {
      this.#profileStore.logout();
      throw new Error('User does not belong to this tenant');
    }

    if (this.#profileStore.isAuthenticated()) {
      await this.#router.navigate(['/']);
    }
  }
}
