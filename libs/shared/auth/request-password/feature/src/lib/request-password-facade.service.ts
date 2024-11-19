/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';
import { AUTH_SERVICE, AuthFormFacade } from '@plastik/auth';
import { getRequestPasswordFormConfig } from './request-password-form.config';

interface RequestPasswordData {
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestPasswordFacadeService implements AuthFormFacade {
  authService = inject(AUTH_SERVICE);
  formStructure = getRequestPasswordFormConfig();
  extraLinks = signal([{ label: "Torna a la pàgina d'entrada", route: '/login' }]);

  onSubmit({ email }: RequestPasswordData): void {
    this.authService.requestPassword(email);
  }
}
