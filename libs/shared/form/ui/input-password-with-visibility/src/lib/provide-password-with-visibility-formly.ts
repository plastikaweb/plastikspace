import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { registerAuthValidatorsTranslateExtension } from '@plastik/shared/form/util';
import { InputPasswordWithVisibilityTypeComponent } from './input-password-with-visibility-type.component';
import { passwordMatchValidator } from './validators/password-match.validator';
import { passwordValidator } from './validators/password.validator';
/**
 * @description Provides the `password-with-visibility` Formly field type and its validators.
 * Registers the field type (extends input) and the `password` and `passwordMatch` validators.
 * Add to route-level providers alongside a Formly core provider and validation message extensions.
 * @returns {EnvironmentProviders} Environment providers for password field support.
 */
export function providePasswordWithVisibilityFormly(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useValue: {
        types: [
          {
            name: 'password-with-visibility',
            extends: 'input',
            component: InputPasswordWithVisibilityTypeComponent,
          },
        ],
        validators: [
          { name: 'password', validation: passwordValidator },
          { name: 'passwordMatch', validation: passwordMatchValidator },
        ],
      },
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerAuthValidatorsTranslateExtension,
      deps: [TranslateService],
    },
  ]);
}
