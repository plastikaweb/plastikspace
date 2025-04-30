import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { TextareaWithCounterTypeComponent } from './textarea-with-counter-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'textarea-with-counter',
          component: TextareaWithCounterTypeComponent,
        },
      ],
    }),
  ],
})
export class TextAreaWithCounterFormlyModule {}
