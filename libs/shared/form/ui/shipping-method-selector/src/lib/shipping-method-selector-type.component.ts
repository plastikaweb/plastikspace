import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

import { CurrencyPipe } from '@angular/common';
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
    CurrencyPipe,
  ],
  templateUrl: './shipping-method-selector-type.component.html',
  styleUrl: './shipping-method-selector-type.component.scss',
  host: {
    class: 'block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodSelectorTypeComponent extends FieldType<
  FieldTypeConfig<ShippingMethodSelectorProps>
> {
  protected getCardStyles(theme: ShippingMethodOption['theme'], isSelected: boolean): string {
    return `shipping-method-card make-it-focusable cursor-pointer relative flex flex-col gap-4 items-center justify-center p-2 md:p-6 transition-all ${isSelected ? 'selected' : ''} ${theme ? `theme-${theme}` : ''}`;
  }
}
