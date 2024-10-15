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
  onTableSorting?(sorting: TableSorting): void;
  onTableActionDelete?(item: unknown): void;
  onGetData?(data: unknown[]): void;
  viewConfig: Signal<ViewConfigUI>;
  formStructure?: Signal<FormlyFieldConfig[]>;
  routingToDetailPage: Signal<{ visible: boolean; path?: string[]; label?: string }>;
  viewExtraActions?: Signal<
    {
      label: string;
      icon: string;
      execute: (element?: T) => void;
      disabled: (element?: T) => boolean;
    }[]
  >;
}

export const TABLE_WITH_FILTERING_FACADE = new InjectionToken<TableWithFilteringFacade<BaseEntity>>(
  'TABLE_WITH_FILTERING_FACADE'
);
