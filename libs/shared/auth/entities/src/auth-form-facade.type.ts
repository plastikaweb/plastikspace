import { InjectionToken, Signal } from '@angular/core';
import { FormConfig } from '@plastik/core/entities';

export interface LoginData {
  email: string;
  password: string;
}

export interface RequestPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ConfirmEmailChangeData {
  token: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthExtraLink {
  label: string;
  route: string;
}

export interface AuthFormFacade<T = LoginData> {
  formConfig: FormConfig<T>;
  extraLinks?: Signal<AuthExtraLink[]>;
  isLoading?: Signal<boolean>;
  onSubmit(data: T): void | Promise<void>;
}

export const AUTH_FORM_FACADE = new InjectionToken<AuthFormFacade<LoginData>>('AUTH_FORM_FACADE');
