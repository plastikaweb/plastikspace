import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { AddressSelectorTypeComponent } from './address-selector-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'address-selector',
          component: AddressSelectorTypeComponent,
        },
      ],
    }),
  ],
})
export class AddressSelectorFormlyModule {}
