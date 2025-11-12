import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import {
  addonsExtension,
  FormlyAddonsWrapperComponent,
  phoneValidator,
  registerValidatorsMessageExtension,
  urlValidator,
} from '@plastik/shared/form/util';

/**
 * @description Provide formly config for the app.
 * @returns {EnvironmentProviders} EnvironmentProviders.
 */
export function provideFormlyConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideFormlyCore([
      {
        wrappers: [{ name: 'addons', component: FormlyAddonsWrapperComponent }],
        extensions: [{ name: 'addons', extension: { onPopulate: addonsExtension } }],
        validators: [
          { name: 'url', validation: urlValidator },
          { name: 'phone', validation: phoneValidator },
        ],
      },
      ...withFormlyMaterial(),
    ]),
    {
      provide: FORMLY_CONFIG,
      useFactory: registerValidatorsMessageExtension,
      multi: true,
    },
  ]);
}
