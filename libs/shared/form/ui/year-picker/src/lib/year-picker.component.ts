import { enUS } from 'date-fns/locale';

import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'yyyy',
  },
  display: {
    dateInput: 'yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
} as const;

@Component({
  selector: 'plastik-year-picker',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: enUS },
    provideDateFnsAdapter(YEAR_MODE_FORMATS),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YearPickerComponent),
      multi: true,
    },
  ],
  templateUrl: './year-picker.component.html',
  styleUrl: './year-picker.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearPickerComponent implements ControlValueAccessor {
  @Input() touchUi = false;
  @Input() label?: string;

  formControl: FormControl = new FormControl();

  protected disabled = false;
  private onChanged!: (value: number) => void;
  private onTouched!: () => void;

  writeValue(year: number): void {
    if (year) this.formControl.setValue(year, { emitEvent: false });
  }

  registerOnChange(fn: (_: unknown) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    if (this.disabled) return;

    datepicker.close();
    this.formControl.setValue(date, { emitEvent: false });
    this.onChanged(date.getFullYear());
    this.onTouched();
  }

  protected onOpenPicker(picker: MatDatepicker<Date>) {
    if (!picker.opened && !this.disabled) picker.open();
  }
}
