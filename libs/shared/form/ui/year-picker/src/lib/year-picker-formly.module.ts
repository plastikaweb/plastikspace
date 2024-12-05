import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { YearPickerTypeComponent } from './year-picker-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'year-picker',
          component: YearPickerTypeComponent,
        },
      ],
    }),
  ],
})
export class YearPickerFormlyModule {}
