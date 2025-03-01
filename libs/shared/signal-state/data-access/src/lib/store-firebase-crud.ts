import { InjectionToken } from '@angular/core';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export interface StoreFirebaseCrudState<T extends BaseEntity, F extends StoreFirebaseCrudFilter> {
  initiallyLoaded: boolean;
  _lastUpdated: Date;
  selectedItemId: EntityId | null;
  sorting: TableSortingConfig;
  pagination: StoreFirebaseCrudPagination<T>;
  filter: F;
  count: number;
  showNotification: boolean;
  baseRoute: string;
}

export type StoreFirebaseCrudPagination<T> = Omit<PageEventConfig, 'previousPageIndex'> & {
  pageLastElements: Map<number, T>;
};

export type StoreFirebaseCrudFilter = Record<string, string | null | boolean>;

export const STORE_TOKEN = new InjectionToken<
  StoreFirebaseCrudState<BaseEntity, StoreFirebaseCrudFilter>
>('STORE_TOKEN');
