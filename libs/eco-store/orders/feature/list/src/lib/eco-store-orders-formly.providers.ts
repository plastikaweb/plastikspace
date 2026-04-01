import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { withFormlyFieldSelect } from '@ngx-formly/material/select';
import { TranslateService } from '@ngx-translate/core';
import {
  registerFormFieldGroupTranslateExtension,
  registerFormFieldTranslateExtension,
  registerValidatorsTranslateExtension,
} from '@plastik/shared/form/util';

/**
 * @description Provides Formly configuration for eco-store orders routes.
 * @returns {EnvironmentProviders} Environment providers for orders form support.
 */
export function provideEcoStoreOrdersFormly(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideFormlyCore([withFormlyFormField(), withFormlyFieldInput(), withFormlyFieldSelect()]),
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
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerFormFieldGroupTranslateExtension,
      deps: [TranslateService],
    },
  ]);
}
