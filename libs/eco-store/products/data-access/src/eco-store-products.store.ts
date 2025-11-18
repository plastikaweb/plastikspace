import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

import { Product } from '@plastik/eco-store/entities';
import { notificationStore } from '@plastik/shared/notification/data-access';

import { ClientResponseError, ListResult, RecordListOptions } from 'pocketbase';
import { EcoStoreProductsApiService } from './eco-store-products-api.service';

export interface ProductsState {
  products: Product[];
  initiallyLoaded: boolean;
  count: number;
}

const initialState: ProductsState = {
  products: [],
  initiallyLoaded: false,
  count: 0,
};

export const ecoStoreProductsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('products'),
  withState<ProductsState>(initialState),
  withMethods(store => {
    const apiService = inject(EcoStoreProductsApiService);
    const notification = inject(notificationStore);

    const showErrorNotification = (error: ClientResponseError): void => {
      notification.show({
        type: 'ERROR',
        message: error.message ?? `products.fullList.error`,
        action: 'notification.close-short',
        duration: 5000,
      });
    };

    return {
      getFullList: rxMethod<RecordListOptions | void>(
        pipe(
          switchMap(options =>
            apiService.getFullList(options || {}).pipe(
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
            apiService.getList(options || {}).pipe(
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
