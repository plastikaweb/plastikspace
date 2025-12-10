import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { LocalizedFields } from '@plastik/core/entities';
import { pipe, switchMap, tap } from 'rxjs';

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
    totalProducts: computed(() => {
      return categories().reduce((acc, category) => acc + category.productCount, 0);
    }),
  })),
  withMethods(store => {
    const apiService = inject(EcoStoreProductCategoriesApiService);
    const notification = inject(notificationStore);
    const translateService = inject(TranslateService);

    const showErrorNotification = (error: ClientResponseError): void => {
      notification.show({
        type: 'ERROR',
        message: error.message ?? `product-categories.fullList.error`,
        action: 'notification.close-short',
        duration: 5000,
      });
    };

    const getLocalizedCategoryName = (category: ProductCategory): string => {
      const name: string | LocalizedFields<string> | undefined = category.name;
      if (!name) {
        return translateService.instant('products.all');
      }
      if (typeof name === 'string') {
        return name;
      }
      const currentLang: string = translateService.getCurrentLang();
      const localizedName: string | undefined =
        name[currentLang as keyof LocalizedFields<string>] ?? name['ca'];
      if (!localizedName) {
        return translateService.instant('products.all');
      }
      return localizedName;
    };

    return {
      getFullList: rxMethod<void>(
        pipe(
          tap(() => updateState(store, '[product-categories] getFullList')),
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

      findCategoryBySlug(slug: string | null): ProductCategory | undefined {
        return store.categories().find((item: ProductCategory) => item.normalizedName === slug);
      },

      getLocalizedCategoryName(category: ProductCategory): string {
        return getLocalizedCategoryName(category);
      },
    };
  }),
  withMethods(store => {
    const translateService = inject(TranslateService);

    return {
      getCategoryTitleBySlug(slug: string | null, defaultText: string): string {
        if (!slug) {
          return translateService.instant(defaultText);
        }
        const category = store.findCategoryBySlug(slug);
        if (!category) {
          return translateService.instant(defaultText);
        }
        return store.getLocalizedCategoryName(category);
      },
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
