import { InjectionToken } from '@angular/core';
import { EntityId } from '@ngrx/signals/entities';
import { FirebaseCrudFilter, FirebaseCrudPagination } from '@plastik/core/api-firebase';
import { BaseEntity } from '@plastik/core/entities';
import { TableSortingConfig } from '@plastik/shared/table/entities';

export type { FirebaseCrudFilter, FirebaseCrudPagination };

/**
 * @description The state for a signal store feature to implement entity CRUD operations with Firebase.
 * @template T The type of the entity.
 * @template F The type of the filter.
 */
export type FirebaseCrudState<T extends BaseEntity, F extends FirebaseCrudFilter> = {
  initiallyLoaded: boolean;
  _activeConnection: boolean;
  _lastUpdated: Date;
  selectedItemId: EntityId | null;
  sorting: TableSortingConfig;
  pagination: FirebaseCrudPagination<T>;
  filter: F;
  count: number;
  showNotification: boolean;
  baseRoute: string | { onCreate: string; onUpdate: string; onError: string };
  _adminOnly: boolean;
  _public: boolean;
};

/**
 * @description The state for a signal store feature to implement entity CRUD operations with Firebase.
 * @deprecated Use FirebaseCrudState instead (without 'Store' prefix)
 */
export type StoreFirebaseCrudState<
  T extends BaseEntity,
  F extends FirebaseCrudFilter,
> = FirebaseCrudState<T, F>;

/**
 * @description The token for a signal store feature to implement entity CRUD operations with Firebase.
 */
export const FIREBASE_STORE_TOKEN = new InjectionToken<
  FirebaseCrudState<BaseEntity, FirebaseCrudFilter>
>('FIREBASE_STORE_TOKEN');
