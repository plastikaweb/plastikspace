import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldType, FieldTypeConfig, FormlyFieldProps, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { NgxColorsModule } from 'ngx-colors';

interface ColorPickerProps extends FormlyFieldProps {
  acceptLabel: string;
  cancelLabel: string;
  colorPalette: string[];
  hideColorPicker: boolean;
  hideTextInput: boolean;
}

@Component({
  selector: 'plastik-input-color-picker-type',
  standalone: true,
  imports: [
    NgxColorsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule,
  ],
  templateUrl: './input-color-picker-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputColorPickerTypeComponent extends FieldType<FieldTypeConfig<ColorPickerProps>> {}
