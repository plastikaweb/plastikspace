/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';
import { AUTH_SERVICE, AuthFormFacade } from '@plastik/auth';

import { getLoginFormConfig } from './login-form.config';

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService implements AuthFormFacade {
  authService = inject(AUTH_SERVICE);
  formStructure = getLoginFormConfig();
  extraLinks = signal([
    { label: 'Registre per sòcies', route: '/registre' },
    { label: 'Has oblidat la contrasenya?', route: '/peticio-clau' },
  ]);

  onSubmit({ email, password }: LoginData): void {
    this.authService.login(email, password);
  }
}
