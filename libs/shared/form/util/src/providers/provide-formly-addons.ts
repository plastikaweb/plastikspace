import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FORMLY_CONFIG } from '@ngx-formly/core';

import { addonsExtension } from '../addons-extension';
import { FormlyAddonsWrapperComponent } from '../addons-wrapper/formly-addons-wrapper.component';

/**
 * @description Provides the `addons` wrapper and the extension that applies it to every field with `props.addonLeft` or `props.addonRight`.
 * Add to route-level providers alongside a Formly core provider such as `providePlainInputFormly()`,
 * for routes that want a leading or trailing icon, text or button without the whole Formly Material set.
 * @returns {EnvironmentProviders} Environment providers for addon support.
 */
export function provideFormlyAddons(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useValue: {
        wrappers: [{ name: 'addons', component: FormlyAddonsWrapperComponent }],
        extensions: [{ name: 'addons', extension: { onPopulate: addonsExtension } }],
      },
    },
  ]);
}
