import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseEntity, ViewConfigUI } from '@plastik/core/entities';
import {
  TableControlStructure,
  TableSorting,
  TableSortingConfig,
} from '@plastik/shared/table/entities';

export interface TableWithFilteringFacade<T extends BaseEntity> {
  tableStructure: Signal<TableControlStructure<T>>;
  tableData: Signal<T[]>;
  tableSorting?: Signal<TableSortingConfig>;
  count: Signal<number>;
  formStructure?: Signal<FormlyFieldConfig[]>;
  viewConfig: Signal<ViewConfigUI>;
  onSorting?(sorting: TableSorting): void;
}

export const TABLE_WITH_FILTERING_FACADE = new InjectionToken<TableWithFilteringFacade<BaseEntity>>(
  'TABLE_WITH_FILTERING_FACADE'
);
