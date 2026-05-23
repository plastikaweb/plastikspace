import { inject, Injectable, signal } from '@angular/core';
import { AuthFormFacade, LoginData } from '@plastik/auth/entities';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';
import { AUTH_SERVICE } from '@plastik/auth/entities';

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService implements AuthFormFacade<LoginData> {
  authService = inject(AUTH_SERVICE);
  formConfig = inject(FORM_TOKEN) as FormConfig<LoginData>;
  extraLinks = signal([
    { label: 'auth.register.label', route: '/registre' },
    { label: 'auth.request-password.label', route: '/peticio-clau' },
  ]);

  async onSubmit({ email, password }: LoginData): Promise<void> {
    await this.authService.login(email, password);
  }
}
