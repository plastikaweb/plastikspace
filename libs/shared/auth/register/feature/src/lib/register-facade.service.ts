/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';
import { AUTH_SERVICE, AuthFormFacade } from '@plastik/auth';

import { getRegisterFormConfig } from './register-form.config';

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterFacadeService implements AuthFormFacade {
  authService = inject(AUTH_SERVICE);
  formStructure = getRegisterFormConfig();
  extraLinks = signal([{ label: "Torna a la pàgina d'entrada", route: '/login' }]);

  onSubmit({ email, password }: LoginData): void {
    this.authService.register(email, password);
  }
}
