import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseEntity, ViewConfigUI } from '@plastik/core/entities';
import { PageEventConfig, TableDefinition, TableSorting } from '@plastik/shared/table/entities';

export interface TableWithFilteringFacade<T extends BaseEntity> {
  viewConfig: Signal<ViewConfigUI>;
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
  tableDefinition: TableDefinition<T>;
  filterFormConfig?: FormlyFieldConfig[];
  filterCriteria?: Signal<Record<string, string>>;
  tableFilterPredicate?: (data: T, criteria: Record<string, string>) => boolean;
  onChangeFilterCriteria?: (criteria: Record<string, string>) => void;
  onTableSorting?(sorting: TableSorting): void;
  onTableActionDelete?(item: unknown): void;
  onChangePagination?(pagination: PageEventConfig): void;
}

export const TABLE_WITH_FILTERING_FACADE = new InjectionToken<TableWithFilteringFacade<BaseEntity>>(
  'TABLE_WITH_FILTERING_FACADE'
);
