import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseEntity, ViewConfigUI } from '@plastik/core/entities';
import { StoreFirebaseCrudFilter } from '@plastik/shared/signal-state-data-access';
import { PageEventConfig, TableDefinition, TableSorting } from '@plastik/shared/table/entities';

export interface TableWithFilteringFacade<
  T extends BaseEntity,
  F extends StoreFirebaseCrudFilter = StoreFirebaseCrudFilter,
> {
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
  filterCriteria?: Signal<F>;
  tableFilterPredicate?: (data: T, criteria: F) => boolean;
  onChangeFilterCriteria?: (criteria: F) => void;
  onTableSorting?(sorting: TableSorting): void;
  onTableActionDelete?(item: T): void;
  onChangePagination?(pagination: PageEventConfig): void;
}

export const TABLE_WITH_FILTERING_FACADE = new InjectionToken<
  TableWithFilteringFacade<BaseEntity, StoreFirebaseCrudFilter>
>('TABLE_WITH_FILTERING_FACADE');
