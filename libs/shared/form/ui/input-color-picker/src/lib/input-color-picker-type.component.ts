import { NgxColorsModule } from 'ngx-colors';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

import { ColorPickerProps } from './color-picker-props';

@Component({
  selector: 'plastik-input-color-picker-type',
  imports: [NgxColorsModule, MatIconModule, MatInputModule, FormlyModule, ReactiveFormsModule],
  templateUrl: './input-color-picker-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputColorPickerTypeComponent extends FieldType<FieldTypeConfig<ColorPickerProps>> {}
