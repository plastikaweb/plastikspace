import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormFacade, LoginData } from '@plastik/auth/entities';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

import { EcoStoreTenantBaseService } from '@plastik/eco-store/tenant';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreAuthLoginFacadeService implements AuthFormFacade<LoginData> {
  readonly #store = inject(pocketBaseUserProfileStore);
  readonly #router = inject(Router);
  readonly #tenantService = inject(EcoStoreTenantBaseService);
  formConfig = inject(FORM_TOKEN) as FormConfig<LoginData>;
  extraLinks = signal([
    { label: 'auth.register.label', route: '/registre' },
    { label: 'auth.request-password.label', route: '/peticio-clau' },
  ]);

  async onSubmit(credentials: LoginData): Promise<void> {
    await this.#store.login(credentials);
    const tenantId = this.#tenantService.tenant()?.id;
    const user = this.#store.user();

    if (tenantId && user?.tenant !== tenantId) {
      this.#store.logout();
      throw new Error('User does not belong to this tenant');
    }

    if (this.#store.isAuthenticated()) {
      await this.#router.navigate(['/']);
    }
  }
}
