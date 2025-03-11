import { computed } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { FormSelectOption } from '@plastik/core/entities';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopCategoryFireService } from './category-fire.service';

export type StoreCategoryFilter = StoreFirebaseCrudFilter & { text: string };

export type UserOrderListStoreCrudState = StoreFirebaseCrudState<
  LlecoopProductCategory,
  StoreCategoryFilter
>;

export const initState: StoreFirebaseCrudState<LlecoopProductCategory, StoreCategoryFilter> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    text: '',
  },
  pagination: {
    pageSize: 10,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopProductCategory>(),
  },
  sorting: ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute: 'admin/categoria',
};

export const llecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withFirebaseCrud<
    LlecoopProductCategory,
    LlecoopCategoryFireService,
    StoreCategoryFilter,
    UserOrderListStoreCrudState
  >({
    featureName: 'category',
    dataServiceType: LlecoopCategoryFireService,
    initState,
  }),
  withComputed(store => ({
    selectByNameOptions: computed(() => {
      const options = store
        .entities()
        .map((category: LlecoopProductCategory) => ({
          label: category.name,
          value: `category/${category.id}`,
        }))
        .sort((a: FormSelectOption, b: FormSelectOption) =>
          (a.label || '').localeCompare(b.label || '')
        );
      return options as FormSelectOption[];
    }),
  }))
);
