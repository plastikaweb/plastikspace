import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseEntity, ViewConfigUI } from '@plastik/core/entities';
import { TableDefinition, TableSorting } from '@plastik/shared/table/entities';

export interface TableWithFilteringFacade<T extends BaseEntity> {
  tableDefinition: TableDefinition<T>;
  filterCriteria?: Signal<Record<string, string>>;
  tableFilterPredicate?: (data: T, criteria: Record<string, string>) => boolean;
  onTableSorting?(sorting: TableSorting): void;
  onTableActionDelete?(item: unknown): void;
  onChangeFilterCriteria?: (criteria: Record<string, string>) => void;
  viewConfig: Signal<ViewConfigUI>;
  formStructure?: Signal<FormlyFieldConfig[]>;
  routingToDetailPage: Signal<{
    visible: boolean;
    disabled?: boolean;
    path?: string[];
    label?: string;
  }>;
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
