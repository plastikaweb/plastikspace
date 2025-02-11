/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
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
  imports: [SharedTableUiComponent, MatInputModule, NgClass],
  templateUrl: './input-table.component.html',
  styleUrl: './input-table.component.scss',
  providers: [INPUT_TABLE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTableComponent<T extends BaseEntity> implements ControlValueAccessor {
  protected readonly cdr = inject(ChangeDetectorRef);

  value = signal<T[]>([]);
  disabled = signal<boolean>(false);
  tablePaginationVisibility = signal<TablePaginationVisibility>({
    hideRangeLabel: true,
    hideRangeButtons: true,
  });

  tableData = input<T[]>([]);
  tableCaption = input<string>('');
  tableColumnProperties = input<TableColumnFormatting<T, FormattingTypes>[]>([]);
  tableDataLength = input<number>();
  tableSorting = input<TableSortingConfig>();
  tableActions = input<TableControlAction<T>>();
  tableExtraRowStyles = input<(element: T) => string>();
  tableRowValueConditionFn = input<(element: T) => boolean>();
  tableNoPagination = input<boolean>(false);
  label = input<string>('');

  computedTableData = computed(() => {
    if (!this.tableData() || this.tableData().length === 0) {
      return this.value();
    }
    if (this.value() && this.value().length > 0) {
      const data = this.tableData().map(element => {
        const isSelected = this.value().find(selectedElement => {
          return selectedElement.id === element.id;
        });
        if (isSelected) {
          return isSelected;
        }
        return element;
      });
      return data || [];
    }
    return this.tableData();
  });

  writeValue(value: T[]): void {
    if (!value || value.length === 0) {
      return;
    }
    if (value.length !== this.value().length) {
      this.value.set(value);
    }
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

  protected onGetChangedData(data?: T): void {
    const addOrRemoveElement = data ? this.tableRowValueConditionFn()?.(data) : false;

    const currentValue = this.value();
    const dataExists = currentValue.some(element => element.id === data?.id);
    if (addOrRemoveElement && !dataExists && data) {
      this.value.set([...currentValue, data]);
    } else if (!addOrRemoveElement && dataExists) {
      this.value.set(currentValue.filter(element => element.id !== data?.id));
    } else if (addOrRemoveElement && dataExists && data) {
      const updatedValue = currentValue.map(element => (element.id === data?.id ? data : element));
      this.value.set(updatedValue);
    } else {
      this.value.set(currentValue);
    }

    this.onChange(this.value());
    this.onTouch();
    this.cdr.detectChanges();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  private onChange(_: unknown | null) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouch() {}
}
