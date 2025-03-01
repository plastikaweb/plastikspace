import { computed } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { FormSelectOption } from '@plastik/core/entities';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import {
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudPagination,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopCategoryFireService } from './category-fire.service';

export type StoreCategoryFilter = StoreFirebaseCrudFilter & { text: string };

export const initCategoryStoreFilter: StoreCategoryFilter = {
  text: '',
};

export const initCategoryStorePagination: StoreFirebaseCrudPagination<LlecoopProductCategory> = {
  pageSize: 10,
  pageIndex: 0,
  pageLastElements: new Map<number, LlecoopProductCategory>(),
};

export const initCategoryStoreSorting = ['updatedAt', 'desc'] as TableSortingConfig;

export const llecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withFirebaseCrud<LlecoopProductCategory, LlecoopCategoryFireService, StoreCategoryFilter>({
    featureName: 'category',
    dataServiceType: LlecoopCategoryFireService,
    initFilter: initCategoryStoreFilter,
    initSorting: initCategoryStoreSorting,
    initPagination: initCategoryStorePagination,
    baseRoute: 'admin/categoria',
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
