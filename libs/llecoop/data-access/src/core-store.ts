/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken, Signal } from '@angular/core';
import { SignalStoreFeature } from '@ngrx/signals';
import { FilterArrayPipeConfig } from '@plastik/shared/filter-array-pipe';
import { TableSorting } from '@plastik/shared/table/entities';

export type StoreFeatureToken = SignalStoreFeature & {
  sorting: Signal<TableSorting>;
  filter: Signal<FilterArrayPipeConfig<any>[]>;
  count: Signal<number>;
  entities: Signal<any[]>;
  setSorting: (sorting: TableSorting) => void;
  setFilter: (filter: FilterArrayPipeConfig<any>[]) => void;
};

export const STORE_TOKEN = new InjectionToken<StoreFeatureToken>('STORE_TOKEN');
