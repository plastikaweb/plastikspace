import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { SharedFormUiCustomLabelComponent } from './shared-form-ui-custom-label.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'custom-label',
          component: SharedFormUiCustomLabelComponent,
        },
      ],
    }),
  ],
})
export class CustomLabelFormlyModule {}
