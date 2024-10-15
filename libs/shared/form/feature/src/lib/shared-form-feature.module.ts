import { NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {
  InputColorPickerTypeComponent,
  InputPasswordWithVisibilityTypeComponent,
  InputTableTypeComponent,
  SharedFormUiYearPickerTypeComponent,
  TextareaWithCounterTypeComponent,
} from '@plastik/shared/form/ui';

import { addonsExtension } from './addons-extension';
import { FormlyAddonsWrapperComponent } from './addons-wrapper/formly-addons-wrapper.component';
import { SharedFormFeatureComponent } from './shared-form-feature.component';
import { registerValidatorsMessageExtension } from './validations/validators-message';
import { passwordMatchValidator } from './validations/validators/password-match.validator';
import { passwordValidator } from './validations/validators/password.validator';
import { urlValidator } from './validations/validators/url.validator';

@NgModule({
  imports: [
    SharedFormFeatureComponent,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      extras: {
        immutable: true,
      },
      wrappers: [{ name: 'addons', component: FormlyAddonsWrapperComponent }],
      extensions: [{ name: 'addons', extension: { onPopulate: addonsExtension } }],
      types: [
        {
          name: 'year-picker',
          component: SharedFormUiYearPickerTypeComponent,
        },
        {
          name: 'password-with-visibility',
          extends: 'input',
          component: InputPasswordWithVisibilityTypeComponent,
        },
        {
          name: 'color-picker',
          component: InputColorPickerTypeComponent,
        },
        {
          name: 'table',
          component: InputTableTypeComponent,
        },
        {
          name: 'textarea-with-counter',
          component: TextareaWithCounterTypeComponent,
          wrappers: ['form-field'],
        },
      ],
      validators: [
        { name: 'url', validation: urlValidator },
        { name: 'password', validation: passwordValidator },
        { name: 'passwordMatch', validation: passwordMatchValidator },
      ],
    }),
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
      },
    },
    {
      provide: FORMLY_CONFIG,
      useFactory: registerValidatorsMessageExtension,
      multi: true,
    },
  ],
  exports: [SharedFormFeatureComponent],
})
export class SharedFormFeatureModule {}
