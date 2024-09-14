import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseEntity, ViewConfigUI } from '@plastik/core/entities';
import { FilterArrayPipeConfig } from '@plastik/shared/filter-array-pipe';
import { TableControlStructure, TableSorting } from '@plastik/shared/table/entities';

export interface TableWithFilteringFacade<T extends BaseEntity> {
  tableStructure: Signal<TableControlStructure<T>>;
  tableData: Signal<T[]>;
  tableSorting?: Signal<TableSorting>;
  tableFilter?: Signal<FilterArrayPipeConfig<T>[]>;
  count: Signal<number>;
  formStructure?: Signal<FormlyFieldConfig[]>;
  viewConfig: Signal<ViewConfigUI>;
  onSorting?(sorting: TableSorting): void;
  onSearch?(search: object): void;
}

export const TABLE_WITH_FILTERING_FACADE = new InjectionToken<TableWithFilteringFacade<BaseEntity>>(
  'TABLE_WITH_FILTERING_FACADE'
);
