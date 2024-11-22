/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';
import { AUTH_SERVICE, AuthFormFacade } from '@plastik/auth';

import { registerFormConfig } from './register-form.config';

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterFacadeService implements AuthFormFacade<LoginData> {
  authService = inject(AUTH_SERVICE);
  formConfig = registerFormConfig();
  extraLinks = signal([{ label: "Torna a la pàgina d'entrada", route: '/login' }]);

  onSubmit({ email, password }: LoginData): void {
    this.authService.register(email, password);
  }
}
