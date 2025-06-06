import { signalStore, withState } from '@ngrx/signals';
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

export type CategoryStoreCrudState = StoreFirebaseCrudState<
  LlecoopProductCategory,
  StoreCategoryFilter
>;

export const categoryMainInitState: StoreFirebaseCrudState<
  LlecoopProductCategory,
  StoreCategoryFilter
> = {
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
  baseRoute: 'categories',
};

export const llecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withState<CategoryStoreCrudState>(categoryMainInitState),
  withFirebaseCrud<
    LlecoopProductCategory,
    LlecoopCategoryFireService,
    StoreCategoryFilter,
    CategoryStoreCrudState
  >({
    featureName: 'category',
    dataServiceType: LlecoopCategoryFireService,
    initState: categoryMainInitState,
  })
);
