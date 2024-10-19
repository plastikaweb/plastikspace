/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BaseEntity } from '@plastik/core/entities';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  TableColumnFormatting,
  TableControlAction,
  TablePaginationVisibility,
  TableSortingConfig,
} from '@plastik/shared/table/entities';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

const INPUT_TABLE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputTableComponent),
  multi: true,
};

@Component({
  selector: 'plastik-input-table',
  standalone: true,
  imports: [SharedTableUiComponent, MatInputModule],
  templateUrl: './input-table.component.html',
  styleUrl: './input-table.component.scss',
  providers: [INPUT_TABLE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTableComponent<T extends BaseEntity> implements ControlValueAccessor {
  value = signal<T[]>([]);
  disabled = signal<boolean>(false);
  tablePaginationVisibility = signal<TablePaginationVisibility>({
    hidePageSize: true,
    hideRangeLabel: true,
    hideRangeButtons: true,
    hidePaginationFirstLastButtons: true,
  });

  tableData = input<T[]>([]);
  tableCaption = input<string>('');
  tableColumnProperties = input<TableColumnFormatting<T, FormattingTypes>[]>([]);
  tableDataLength = input<number>();
  tableSorting = input<TableSortingConfig>();
  tableActions = input<TableControlAction<T>>();
  tableExtraRowStyles = input<(element: T) => string>();
  tableRowValueConditionFn = input<(element: T) => boolean>();
  label = input<string>('');

  writeValue(value: T[]): void {
    this.value.set(value || []);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onGetChangedData(data: T): void {
    const addOrRemoveElement = this.tableRowValueConditionFn()?.(data);

    const currentValue = this.value();
    const dataExists = currentValue.some(element => element.id === data.id);
    if (addOrRemoveElement && !dataExists) {
      this.value.set([...currentValue, data]);
    } else if (!addOrRemoveElement && dataExists) {
      this.value.set(currentValue.filter(element => element.id !== data.id));
    } else if (addOrRemoveElement && dataExists) {
      const updatedValue = currentValue.map(element => (element.id === data.id ? data : element));
      this.value.set(updatedValue);
    } else {
      this.value.set(currentValue);
    }

    this.onChange(this.value());
    this.onTouch();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  private onChange(_: unknown | null) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouch() {}
}
