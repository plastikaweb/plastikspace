import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormFacade, LoginData } from '@plastik/auth/entities';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreAuthLoginFacadeService implements AuthFormFacade<LoginData> {
  store = inject(pocketBaseUserProfileStore);
  router = inject(Router);
  formConfig = inject(FORM_TOKEN) as FormConfig<LoginData>;
  extraLinks = signal([
    { label: 'auth.register.label', route: '/registre' },
    { label: 'auth.request-password.label', route: '/peticio-clau' },
  ]);

  async onSubmit(credentials: LoginData): Promise<void> {
    await this.store.login(credentials);
    if (this.store.isAuthenticated()) {
      await this.router.navigate(['/']);
    }
  }
}
