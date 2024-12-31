import { inject, Injectable, signal } from '@angular/core';
import { AUTH_SERVICE, AuthFormFacade } from '@plastik/auth';

import { requestPasswordFormConfig } from './request-password-form.config';

export interface RequestPasswordData {
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestPasswordFacadeService implements AuthFormFacade<RequestPasswordData> {
  authService = inject(AUTH_SERVICE);
  formConfig = requestPasswordFormConfig();
  extraLinks = signal([{ label: "Torna a la pàgina d'entrada", route: '/login' }]);

  onSubmit({ email }: RequestPasswordData): void {
    this.authService.requestPassword(email);
  }
}
