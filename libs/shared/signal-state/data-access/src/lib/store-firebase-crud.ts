import { InjectionToken } from '@angular/core';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export type StoreFirebaseCrudState<T extends BaseEntity, F extends StoreFirebaseCrudFilter> = {
  initiallyLoaded: boolean;
  _activeConnection: boolean;
  _lastUpdated: Date;
  selectedItemId: EntityId | null;
  sorting: TableSortingConfig;
  pagination: StoreFirebaseCrudPagination<T>;
  filter: F;
  count: number;
  showNotification: boolean;
  baseRoute: string;
};

export type StoreFirebaseCrudStateBase = Pick<
  StoreFirebaseCrudState<BaseEntity, StoreFirebaseCrudFilter>,
  'initiallyLoaded' | '_lastUpdated' | 'selectedItemId' | 'count' | 'showNotification'
>;

export type StoreFirebaseCrudPagination<T> = Omit<PageEventConfig, 'previousPageIndex'> & {
  pageLastElements: Map<number, T>;
};

export type StoreFirebaseCrudFilter = Record<string, string | null | boolean>;

export const STORE_TOKEN = new InjectionToken<
  StoreFirebaseCrudState<BaseEntity, StoreFirebaseCrudFilter>
>('STORE_TOKEN');
