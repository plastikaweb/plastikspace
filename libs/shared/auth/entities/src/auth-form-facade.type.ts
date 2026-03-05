import { InjectionToken, Signal } from '@angular/core';
import { FormConfig } from '@plastik/core/entities';

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthFormFacade<T = LoginData> {
  formConfig: FormConfig<T>;
  extraLinks?: Signal<{ label: string; route: string }[]>;
  onSubmit(search: object): void;
}

export const AUTH_FORM_FACADE = new InjectionToken<AuthFormFacade<LoginData>>('AUTH_FORM_FACADE');
