import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { FormlyModule, provideFormlyCore } from '@ngx-formly/core';

import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { InputSearchTypeComponent } from './input-search-type.component';

/**
 * @description Provides the Formly configuration for the input search type.
 * @returns {EnvironmentProviders} The Formly configuration for the input search type.
 */
export function provideInputSearchFormly(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideFormlyCore([withFormlyFormField(), withFormlyFieldInput()]),
    importProvidersFrom(
      FormlyModule.forChild({
        types: [
          {
            name: 'input-search',
            component: InputSearchTypeComponent,
          },
        ],
      })
    ),
  ]);
}
