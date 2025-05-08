import { inject, Injectable, signal } from '@angular/core';
import { AUTH_SERVICE, AuthFormFacade } from '@plastik/auth';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService implements AuthFormFacade<LoginData> {
  authService = inject(AUTH_SERVICE);
  formConfig = inject(FORM_TOKEN) as FormConfig<LoginData>;
  extraLinks = signal([
    { label: 'Registre per sòcies', route: '/registre' },
    { label: 'Has oblidat la contrasenya?', route: '/peticio-clau' },
  ]);
  async onSubmit({ email, password }: LoginData): Promise<void> {
    await this.authService.login(email, password);
  }
}
