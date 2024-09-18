/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';
import { AUTH_FACADE, AuthFormFacade } from '@plastik/auth';

import { getLoginFormConfig } from './login-form.config';

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginFacadeService implements AuthFormFacade<any> {
  authService = inject(AUTH_FACADE);
  formStructure = getLoginFormConfig();

  onSubmit({ email, password }: LoginData): void {
    this.authService.login(email, password);
  }
}
