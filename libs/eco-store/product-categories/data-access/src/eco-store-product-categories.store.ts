import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

import { ProductCategory, ProductCategoryGroup } from '@plastik/eco-store/entities';
import { notificationStore } from '@plastik/shared/notification/data-access';

import { ClientResponseError } from 'pocketbase';
import { EcoStoreProductCategoriesApiService } from './eco-store-product-categories-api.service';

export interface ProductCategoriesState {
  categories: ProductCategory[];
  initiallyLoaded: boolean;
}

const initialState: ProductCategoriesState = {
  categories: [],
  initiallyLoaded: false,
};

export const ecoStoreProductCategoriesStore = signalStore(
  { providedIn: 'root' },
  withDevtools('productsCategories'),
  withState<ProductCategoriesState>(initialState),
  withComputed(({ categories }) => ({
    groupedCategories: computed(() => {
      const groups = new Map<
        string,
        { group: ProductCategoryGroup; categories: ProductCategory[] }
      >();

      categories().forEach(category => {
        const group = category.expand?.group;
        if (group) {
          if (!groups.has(group.id)) {
            groups.set(group.id, { group, categories: [] });
          }
          groups.get(group.id)?.categories.push(category);
        }
      });

      return Array.from(groups.values());
    }),
  })),
  withMethods(store => {
    const apiService = inject(EcoStoreProductCategoriesApiService);
    const notification = inject(notificationStore);

    const showErrorNotification = (error: ClientResponseError): void => {
      notification.show({
        type: 'ERROR',
        message: error.message ?? `product-categories.fullList.error`,
        action: 'notification.close-short',
        duration: 5000,
      });
    };

    return {
      getFullList: rxMethod<void>(
        pipe(
          switchMap(() =>
            apiService.getFullList().pipe(
              tapResponse<ProductCategory[], ClientResponseError>({
                next: categories => {
                  updateState(store, '[product-categories] getFullList success', {
                    categories,
                    initiallyLoaded: true,
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
        store.getFullList();
      }
    },
  })
);
