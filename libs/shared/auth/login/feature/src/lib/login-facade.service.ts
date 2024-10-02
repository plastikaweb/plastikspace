/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';
import { AUTH_FACADE, AuthFormFacade } from '@plastik/auth';

import { getLoginFormConfig } from './login-form.config';

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService implements AuthFormFacade {
  authService = inject(AUTH_FACADE);
  formStructure = getLoginFormConfig();
  extraLinks = signal([
    { label: 'Registre per sòcies', route: '/registre' },
    { label: 'Has oblidat la contrasenya?', route: '/peticio-clau' },
  ]);

  onSubmit({ email, password }: LoginData): void {
    this.authService.login(email, password);
  }
}
