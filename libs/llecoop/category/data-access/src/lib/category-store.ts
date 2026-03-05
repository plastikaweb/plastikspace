import { signalStore, withState } from '@ngrx/signals';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { TableSortingConfig } from '@plastik/shared/table/entities';
import {
  FirebaseCrudFilter,
  FirebaseCrudState,
  initStoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/signal-state/firebase';

import { LlecoopCategoryFireService } from './category-fire.service';

export type CategoryFilter = FirebaseCrudFilter & { text: string };

export type CategoryStoreCrudState = FirebaseCrudState<LlecoopProductCategory, CategoryFilter>;

export const categoryMainInitState: CategoryStoreCrudState = {
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
    CategoryFilter,
    CategoryStoreCrudState
  >({
    featureName: 'category',
    dataServiceType: LlecoopCategoryFireService,
    initState: categoryMainInitState,
  })
);
