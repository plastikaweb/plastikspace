import { filter, pipe, switchMap } from 'rxjs';

import { updateState } from '@angular-architects/ngrx-toolkit';
import { tapResponse } from '@ngrx/operators';
import { signalStore, watchState, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
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

export type CategoryStoreCrudState = StoreFirebaseCrudState<
  LlecoopProductCategory,
  StoreCategoryFilter
> & {
  categoriesList: FormSelectOption[];
};

type SpecificCategoryStoreFirebaseCrudState = Omit<
  CategoryStoreCrudState,
  keyof StoreFirebaseCrudState<LlecoopProductCategory, StoreCategoryFilter>
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

export const specificInitState: SpecificCategoryStoreFirebaseCrudState = {
  categoriesList: [],
};

export const llecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withState<SpecificCategoryStoreFirebaseCrudState>(specificInitState),
  withFirebaseCrud<
    LlecoopProductCategory,
    LlecoopCategoryFireService,
    StoreCategoryFilter,
    CategoryStoreCrudState
  >({
    featureName: 'category',
    dataServiceType: LlecoopCategoryFireService,
    initState: { ...categoryMainInitState, ...specificInitState },
  }),
  withMethods(store => ({
    getCategoryList: rxMethod<void>(
      pipe(
        filter(() => !!store._activeConnection()),
        switchMap(() => {
          return store._dataService.getAllCategories().pipe(
            tapResponse({
              next: categories => {
                const categoriesList = categories
                  .map(category => ({
                    value: `category/${category.id}`,
                    label: category.name,
                  }))
                  .sort((a: FormSelectOption, b: FormSelectOption) =>
                    (a.label || '').localeCompare(b.label || '')
                  );
                updateState(store, `[category] get category list`, { categoriesList });
              },
              error: error =>
                store._storeNotificationService.create(
                  `No s'ha pogut carregar la llista de categories: ${error}`,
                  'ERROR'
                ),
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      watchState(store, () => {
        if (store._activeConnection() && !store.categoriesList().length) {
          store.getCategoryList();
        }
      });
    },
  })
);
