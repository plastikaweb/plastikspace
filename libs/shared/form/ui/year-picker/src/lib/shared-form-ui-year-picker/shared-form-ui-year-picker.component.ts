import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Moment } from 'moment';

export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'plastik-shared-form-ui-year-picker',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedFormUiYearPickerComponent),
      multi: true,
    },
  ],
  templateUrl: './shared-form-ui-year-picker.component.html',
  styleUrls: ['./shared-form-ui-year-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedFormUiYearPickerComponent implements ControlValueAccessor {
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

  protected onYearSelected(date: Moment, datepicker: MatDatepicker<Moment>) {
    if (this.disabled) return;

    datepicker.close();

    date.set({ date: 1 });
    this.formControl.setValue(date, { emitEvent: false });
    this.onChanged(date.toDate().getFullYear());
    this.onTouched();
  }

  protected onOpenPicker(picker: MatDatepicker<Moment>) {
    if (!picker.opened && !this.disabled) picker.open();
  }
}
