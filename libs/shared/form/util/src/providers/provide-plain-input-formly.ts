import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { TranslateService } from '@ngx-translate/core';
import {
  registerFormFieldTranslateExtension,
  registerValidatorsTranslateExtension,
} from '../translate';

/**
 * @description Provides minimal Formly configuration for importing in routes.
 * Includes Material form-field + input, field translation, and common validator messages.
 * For password fields, add `providePasswordWithVisibilityFormly()` separately.
 * For auth-specific validator messages (password, passwordMatch), add `registerAuthValidatorsTranslateExtension` separately.
 * @returns {EnvironmentProviders} Environment providers for form support.
 */
export function providePlainInputFormly(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideFormlyCore([withFormlyFormField(), withFormlyFieldInput()]),
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerFormFieldTranslateExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerValidatorsTranslateExtension,
      deps: [TranslateService],
    },
  ]);
}
