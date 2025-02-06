import { InjectionToken } from '@angular/core';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export interface LlecoopFeatureStore<T extends BaseEntity> {
  loaded: boolean;
  lastUpdated: Date;
  sorting: TableSortingConfig;
  selectedItemId: EntityId | null;
  pagination: LlecoopFeatureStorePagination<T>;
  count: number;
}

export type LlecoopFeatureStorePagination<T> = Omit<PageEventConfig, 'previousPageIndex'> & {
  pageLastElements: Map<number, T>;
};

export const STORE_TOKEN = new InjectionToken<LlecoopFeatureStore<BaseEntity>>('STORE_TOKEN');
