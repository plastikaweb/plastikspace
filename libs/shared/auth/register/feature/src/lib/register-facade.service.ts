import { inject, Injectable, signal } from '@angular/core';
import { AUTH_SERVICE, AuthFormFacade } from '@plastik/auth';

import { registerFormConfig } from './register-form.config';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterFacadeService implements AuthFormFacade<RegisterData> {
  authService = inject(AUTH_SERVICE);
  formConfig = registerFormConfig();
  extraLinks = signal([{ label: "Torna a la pàgina d'entrada", route: '/login' }]);

  onSubmit({ email, password, name }: RegisterData): void {
    this.authService.register(email, password, name);
  }
}
