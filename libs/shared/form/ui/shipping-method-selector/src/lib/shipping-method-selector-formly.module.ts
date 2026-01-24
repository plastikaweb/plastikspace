import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { ShippingMethodSelectorTypeComponent } from './shipping-method-selector-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'shipping-method-selector',
          component: ShippingMethodSelectorTypeComponent,
        },
      ],
    }),
  ],
})
export class ShippingMethodSelectorFormlyModule {}
