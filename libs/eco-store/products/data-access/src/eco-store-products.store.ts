import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

import { Product } from '@plastik/eco-store/entities';
import { notificationStore } from '@plastik/shared/notification/data-access';

import {
  BasePocketBaseEntityFilter,
  BasePocketBaseEntityPagination,
  BasePocketBaseEntitySort,
} from '@plastik/eco-store/entities';
import { ClientResponseError, ListResult, RecordListOptions } from 'pocketbase';
import { EcoStoreProductsApiService } from './eco-store-products-api.service';

export interface ProductsState {
  products: Product[];
  initiallyLoaded: boolean;
  count: number;
  selectedItemId: Product['id'] | null;
  sort: BasePocketBaseEntitySort;
  pagination: BasePocketBaseEntityPagination;
  filter: BasePocketBaseEntityFilter;
}

const initialState: ProductsState = {
  products: [],
  initiallyLoaded: false,
  count: 0,
  selectedItemId: null,
  sort: { sort: 'updated', direction: 'desc' },
  pagination: {
    page: 1,
    perPage: 10,
  },
  filter: {},
};

export const ecoStoreProductsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('products'),
  withState<ProductsState>(initialState),
  withProps(() => ({
    _apiService: inject(EcoStoreProductsApiService),
    _storeNotificationService: inject(notificationStore),
  })),
  withMethods(store => {
    const showErrorNotification = (error: ClientResponseError): void => {
      store._storeNotificationService.show({
        type: 'ERROR',
        message: error.message ?? `products.fullList.error`,
        action: 'notification.close-short',
        duration: 5000,
      });
    };

    return {
      setPagination: (pagination: BasePocketBaseEntityPagination) =>
        updateState(store, '[products] set pagination', {
          pagination,
        }),

      setFilter: (filter: BasePocketBaseEntityFilter) =>
        updateState(store, '[products] set filter', {
          filter,
        }),

      setSort: (sort: BasePocketBaseEntitySort) =>
        updateState(store, '[products] set sort', {
          sort,
        }),

      resetConfig: (
        pagination?: BasePocketBaseEntityPagination,
        filter?: BasePocketBaseEntityFilter,
        sort?: BasePocketBaseEntitySort
      ) => {
        updateState(store, '[products] reset table config', {
          pagination: pagination ?? initialState.pagination,
          filter: filter ?? initialState.filter,
          sort: sort ?? initialState.sort,
        });
      },

      getFullList: rxMethod<RecordListOptions | void>(
        pipe(
          switchMap(options =>
            store._apiService.getFullList(options || {}).pipe(
              tapResponse<Product[], ClientResponseError>({
                next: products => {
                  updateState(store, '[products] getFullList success', {
                    products,
                    initiallyLoaded: true,
                  });
                },
                error: error => showErrorNotification(error),
              })
            )
          )
        )
      ),

      getList: rxMethod<RecordListOptions | void>(
        pipe(
          switchMap(options =>
            store._apiService.getList(options || {}).pipe(
              tapResponse<ListResult<Product>, ClientResponseError>({
                next: products => {
                  updateState(store, '[products] getList success', {
                    products: products.items,
                    initiallyLoaded: true,
                    count: products.totalItems,
                  });
                },
                error: error => showErrorNotification(error),
              })
            )
          )
        )
      ),
    };
  }),
  withHooks({
    onInit(store) {
      if (!store.initiallyLoaded()) {
        store.getList();
      }
    },
  })
);
