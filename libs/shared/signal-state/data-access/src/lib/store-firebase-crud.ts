import { InjectionToken } from '@angular/core';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

/**
 * @description The state for a signal store feature to implement entity CRUD operations with Firebase.
 * @template T The type of the entity.
 * @template F The type of the filter.
 */
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
  baseRoute: string | { onCreate: string; onUpdate: string; onError: string };
};

/**
 * @description The base state for a signal store feature to implement entity CRUD operations with Firebase.
 * @template T The type of the entity.
 * @template F The type of the filter.
 */
export type StoreFirebaseCrudStateBase = Pick<
  StoreFirebaseCrudState<BaseEntity, StoreFirebaseCrudFilter>,
  'initiallyLoaded' | '_lastUpdated' | 'selectedItemId' | 'count' | 'showNotification'
>;

/**
 * @description The pagination state for a signal store feature to implement entity CRUD operations with Firebase.
 * @template T The type of the entity.
 */
export type StoreFirebaseCrudPagination<T> = Omit<PageEventConfig, 'previousPageIndex'> & {
  pageLastElements: Map<number, T>;
};

/**
 * @description The filter state for a signal store feature to implement entity CRUD operations with Firebase.
 */
export type StoreFirebaseCrudFilter = Record<string, string | null | boolean>;

/**
 * @description The token for a signal store feature to implement entity CRUD operations with Firebase.
 */
export const STORE_TOKEN = new InjectionToken<
  StoreFirebaseCrudState<BaseEntity, StoreFirebaseCrudFilter>
>('STORE_TOKEN');
