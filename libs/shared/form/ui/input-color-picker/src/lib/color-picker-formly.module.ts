import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { InputColorPickerTypeComponent } from './input-color-picker-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'color-picker',
          component: InputColorPickerTypeComponent,
        },
      ],
    }),
  ],
})
export class ColorPickerFormlyModule {}
