import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { InputSearchTypeComponent } from './input-search-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'input-search',
          component: InputSearchTypeComponent,
        },
      ],
    }),
  ],
})
export class InputSearchFormlyModule {}
