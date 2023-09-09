import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps, FormlyModule } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { SharedFormUiYearPickerComponent } from './shared-form-ui-year-picker.component';

interface DatepickerProps extends FormlyFieldProps {
  dataTest: string;
  touchUi: boolean;
  disabled: boolean;
  min: number;
  max: number;
}

@Component({
  selector: 'plastik-shared-form-ui-year-picker-type',
  standalone: true,
  templateUrl: './shared-form-ui-year-picker-type.component.html',
  imports: [SharedFormUiYearPickerComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormlyModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormUiYearPickerTypeComponent extends FieldType<FieldTypeConfig<Partial<DatepickerProps>>> {}
