import { InjectionToken, Signal } from '@angular/core';
import { FormConfig } from '@plastik/core/entities';

export interface AuthFormFacade<T> {
  formConfig: FormConfig<T>;
  extraLinks?: Signal<{ label: string; route: string }[]>;
  onSubmit(search: object): void;
}

export const AUTH_FORM_FACADE = new InjectionToken<AuthFormFacade<unknown>>('AUTH_FORM_FACADE');
