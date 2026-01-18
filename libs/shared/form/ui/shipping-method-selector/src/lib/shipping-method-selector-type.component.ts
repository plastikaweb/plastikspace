import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import {
  ShippingMethodOption,
  ShippingMethodSelectorProps,
} from './shipping-method-selector-props';

@Component({
  selector: 'plastik-shipping-method-selector-type',
  imports: [
    MatRadioModule,
    MatIconModule,
    MatCardModule,
    TranslateModule,
    FormlyModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './shipping-method-selector-type.component.html',
  styleUrl: './shipping-method-selector-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodSelectorTypeComponent extends FieldType<
  FieldTypeConfig<ShippingMethodSelectorProps>
> {
  protected getCardStyles(theme: ShippingMethodOption['theme'], isSelected: boolean): string {
    return `shipping-method-card cursor-pointer relative flex flex-col gap-4 items-center justify-center p-6 transition-all ${isSelected ? 'selected' : ''} ${theme ? `theme-${theme}` : ''}`;
  }
}
