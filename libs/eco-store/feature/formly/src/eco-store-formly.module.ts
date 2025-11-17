import { NgModule } from '@angular/core';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { InputSearchTypeComponent } from '@plastik/shared/form/input-search';

import {
  addonsExtension,
  FormlyAddonsWrapperComponent,
  phoneValidator,
  registerButtonTranslateExtension,
  registerFormFieldGroupTranslateExtension,
  registerFormFieldTranslateExtension,
  registerValidatorsTranslateExtension,
  urlValidator,
} from '@plastik/shared/form/util';

import { TranslateService } from '@ngx-translate/core';

@NgModule({
  providers: [
    provideFormlyCore([
      ...withFormlyMaterial(),
      {
        wrappers: [{ name: 'addons', component: FormlyAddonsWrapperComponent }],
        types: [
          {
            name: 'input-search',
            component: InputSearchTypeComponent,
          },
        ],
        extensions: [{ name: 'addons', extension: { onPopulate: addonsExtension } }],
        validators: [
          { name: 'url', validation: urlValidator },
          { name: 'phone', validation: phoneValidator },
        ],
      },
    ]),
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerFormFieldTranslateExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerFormFieldGroupTranslateExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerButtonTranslateExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerValidatorsTranslateExtension,
      deps: [TranslateService],
    },
  ],
})
export class EcoStoreFormlyModule {}
