import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

export interface AuthFormFacade<T> {
  formStructure?: Signal<FormlyFieldConfig[]>;
  onSubmit(search: object): void;
}

export const AUTH_FORM_FACADE = new InjectionToken<AuthFormFacade<unknown>>('AUTH_FORM_FACADE');
