import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { SharedFormUiTextTypeComponent } from './shared-form-ui-text.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'text',
          component: SharedFormUiTextTypeComponent,
        },
      ],
    }),
  ],
})
export class TextFormlyModule {}
