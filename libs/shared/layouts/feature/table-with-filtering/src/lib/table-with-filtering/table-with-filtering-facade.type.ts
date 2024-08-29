import { InjectionToken, Signal } from '@angular/core';
import { BaseEntity } from '@plastik/core/entities';
import { TableControlStructure, TableSorting } from '@plastik/shared/table/entities';

export interface TableWithFilteringFacade<T extends BaseEntity> {
  tableStructure: Signal<TableControlStructure<T>>;
  tableData: Signal<T[]>;
  count: Signal<number>;
  viewName: string;
  onChangeSorting(sorting: TableSorting): void;
}

export const TABLE_WITH_FILTERING_TOKEN = new InjectionToken<TableWithFilteringFacade<BaseEntity>>(
  'TABLE_WITH_FILTERING_TOKEN'
);
