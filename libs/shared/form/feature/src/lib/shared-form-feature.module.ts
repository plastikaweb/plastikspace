import { NgModule } from '@angular/core';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {
  addonsExtension,
  FormlyAddonsWrapperComponent,
  phoneValidator,
  registerValidatorsMessageExtension,
  urlValidator,
} from '@plastik/shared/form/util';

import { SharedFormFeatureComponent } from './shared-form-feature.component';

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
      validators: [
        { name: 'url', validation: urlValidator },
        { name: 'phone', validation: phoneValidator },
      ],
    }),
  ],
  providers: [
    {
      provide: FORMLY_CONFIG,
      useFactory: registerValidatorsMessageExtension,
      multi: true,
    },
  ],
  exports: [SharedFormFeatureComponent],
})
export class SharedFormFeatureModule {}
