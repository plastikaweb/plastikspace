/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';
import { AUTH_FACADE, AuthFormFacade } from '@plastik/auth';

import { getRegisterFormConfig } from './register-form.config';

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterFacadeService implements AuthFormFacade {
  authService = inject(AUTH_FACADE);
  formStructure = getRegisterFormConfig();

  onSubmit({ email, password }: LoginData): void {
    this.authService.register(email, password);
  }
}
