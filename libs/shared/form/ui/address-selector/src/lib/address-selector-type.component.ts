import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { SharedChipComponent } from '@plastik/shared/chip/ui';
import { AddressSelectorProps } from './address-selector-props';

@Component({
  selector: 'plastik-address-selector-type',
  imports: [
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    FormlyModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    MatCardModule,
    SharedChipComponent,
  ],
  templateUrl: './address-selector-type.component.html',
  styleUrl: './address-selector-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressSelectorTypeComponent extends FieldType<FieldTypeConfig<AddressSelectorProps>> {
  onEdit(address: AddressSelectorProps['addresses'][number], event: Event): void {
    event.stopPropagation();
    if (this.props.onEdit) {
      this.props.onEdit(address);
    }
  }
}
