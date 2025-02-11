import { InjectionToken } from '@angular/core';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export interface LlecoopFeatureStore<T extends BaseEntity> {
  loaded: boolean;
  lastUpdated: Date;
  selectedItemId: EntityId | null;
  sorting: TableSortingConfig;
  pagination: LlecoopFeatureStorePagination<T>;
  filter: Record<string, string | null | boolean>;
  count: number;
}

export type LlecoopFeatureStorePagination<T> = Omit<PageEventConfig, 'previousPageIndex'> & {
  pageLastElements: Map<number, T>;
};

export const STORE_TOKEN = new InjectionToken<LlecoopFeatureStore<BaseEntity>>('STORE_TOKEN');
