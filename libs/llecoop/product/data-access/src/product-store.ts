import { filter, pipe, switchMap } from 'rxjs';

import { updateState } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, watchState, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FormSelectOption } from '@plastik/core/entities';
import { LlecoopCategoryFireService } from '@plastik/llecoop/category/data-access';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopProductFireService } from './product-fire.service';

export type StoreProductFilter = StoreFirebaseCrudFilter & {
  text: string;
  category: 'all' | string;
  inStock: 'all' | true | false;
};

export type ProductStoreFirebaseCrudState = StoreFirebaseCrudState<
  LlecoopProduct,
  StoreProductFilter
> & {
  categories: FormSelectOption[];
};

type SpecificProductStoreFirebaseCrudState = Omit<
  ProductStoreFirebaseCrudState,
  keyof StoreFirebaseCrudState<LlecoopProduct, StoreProductFilter>
>;

export const productMainInitState: StoreFirebaseCrudState<LlecoopProduct, StoreProductFilter> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    text: '',
    category: 'all',
    inStock: 'all',
  },
  pagination: {
    pageSize: 10,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopProduct>(),
  },
  sorting: ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute: 'admin/producte',
};

const specificInitState: SpecificProductStoreFirebaseCrudState = {
  categories: [],
};

export const llecoopProductStore = signalStore(
  { providedIn: 'root' },
  withState<SpecificProductStoreFirebaseCrudState>(specificInitState),
  withFirebaseCrud<
    LlecoopProduct,
    LlecoopProductFireService,
    StoreProductFilter,
    StoreFirebaseCrudState<LlecoopProduct, StoreProductFilter>
  >({
    featureName: 'product',
    dataServiceType: LlecoopProductFireService,
    initState: { ...productMainInitState, ...specificInitState },
  }),
  withMethods(store => {
    const categoryFireService = inject(LlecoopCategoryFireService);
    return {
      getCategoryList: rxMethod<void>(
        pipe(
          filter(() => !!store._activeConnection()),
          switchMap(() => {
            return categoryFireService.getAllCategories().pipe(
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
                  updateState(store, `[product] get category list`, { categories: categoriesList });
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
    };
  }),
  withHooks({
    onInit(store) {
      watchState(store, () => {
        if (store._activeConnection() && !store.categories().length) {
          store.getCategoryList();
        }
      });
    },
  })
);
