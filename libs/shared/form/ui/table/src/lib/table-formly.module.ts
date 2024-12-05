import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { InputTableTypeComponent } from './input-table-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'table',
          component: InputTableTypeComponent,
        },
      ],
    }),
  ],
})
export class TableFormlyModule {}
