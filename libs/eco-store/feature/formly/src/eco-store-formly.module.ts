import { NgModule } from '@angular/core';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { withFormlyFieldRadio } from '@ngx-formly/material/radio';
import { withFormlyFieldSelect } from '@ngx-formly/material/select';
import { withFormlyFieldTextArea } from '@ngx-formly/material/textarea';
import { InputSearchTypeComponent } from '@plastik/shared/form/input-search';

import {
  addonsExtension,
  FormlyAddonsWrapperComponent,
  registerButtonTranslateExtension,
  registerFormFieldGroupTranslateExtension,
  registerFormFieldTranslateExtension,
  registerValidatorsTranslateExtension,
} from '@plastik/shared/form/util';

import { TranslateService } from '@ngx-translate/core';

@NgModule({
  providers: [
    provideFormlyCore([
      withFormlyFormField(),
      withFormlyFieldInput(),
      withFormlyFieldTextArea(),
      withFormlyFieldRadio(),
      withFormlyFieldSelect(),
      {
        wrappers: [{ name: 'addons', component: FormlyAddonsWrapperComponent }],
        types: [
          {
            name: 'input-search',
            component: InputSearchTypeComponent,
            wrappers: ['addons'],
          },
        ],
        extensions: [{ name: 'addons', extension: { onPopulate: addonsExtension } }],
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
