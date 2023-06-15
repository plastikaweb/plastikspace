import { NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { SharedFormUiYearPickerTypeComponent } from '@plastik/shared/form/ui';

import { addonsExtension } from './addons-extension';
import { FormlyAddonsWrapperComponent } from './addons-wrapper/formly-addons-wrapper.component';
import { SharedFormFeatureComponent } from './shared-form-feature.component';
import {
  maxLengthValidationMessage,
  maxValidationMessage,
  minLengthValidationMessage,
  minValidationMessage,
  requiredValidationMessage,
} from './shared-form-validation.util';

@NgModule({
  imports: [
    SharedFormFeatureComponent,
    FormlyModule.forRoot({
      extras: {
        immutable: true,
      },
      wrappers: [{ name: 'addons', component: FormlyAddonsWrapperComponent }],
      extensions: [{ name: 'addons', extension: { onPopulate: addonsExtension } }],
      validationMessages: [
        { name: 'required', message: requiredValidationMessage },
        { name: 'minLength', message: minLengthValidationMessage },
        { name: 'maxLength', message: maxLengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
      ],
      types: [
        {
          name: 'year-picker',
          component: SharedFormUiYearPickerTypeComponent,
        },
      ],
    }),
    FormlyMaterialModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      },
    },
  ],
  exports: [SharedFormFeatureComponent],
})
export class SharedFormFeatureModule {}
