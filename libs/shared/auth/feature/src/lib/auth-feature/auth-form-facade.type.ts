import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

export interface AuthFormFacade {
  formStructure?: Signal<FormlyFieldConfig[]>;
  onSubmit(search: object): void;
}

export const AUTH_FORM_FACADE = new InjectionToken<AuthFormFacade>('AUTH_FORM_FACADE');
