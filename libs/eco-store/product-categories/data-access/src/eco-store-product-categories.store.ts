import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { LocalizedFields } from '@plastik/core/entities';
import { pipe, switchMap, tap } from 'rxjs';

import {
  ProductCategory,
  ProductCategoryGroup,
  ProductCategoryStats,
} from '@plastik/eco-store/entities';
import { notificationStore } from '@plastik/shared/notification/data-access';

import { ALL_PRODUCTS_ICON } from '@plastik/eco-store/shared/tokens';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { ClientResponseError } from 'pocketbase';
import { EcoStoreProductCategoriesStatsService } from './eco-store-product-categories-stats.service';

export interface ProductCategoriesState {
  stats: ProductCategoryStats[];
  initiallyLoaded: boolean;
}

const initialState: ProductCategoriesState = {
  stats: [],
  initiallyLoaded: false,
};

export const ecoStoreProductCategoriesStore = signalStore(
  { providedIn: 'root' },
  withDevtools('productsCategories'),
  withState<ProductCategoriesState>(initialState),
  withProps(() => ({
    _statsService: inject(EcoStoreProductCategoriesStatsService),
    _notification: inject(notificationStore),
    _translateService: inject(TranslateService),
    _tenantStore: inject(ecoStoreTenantStore),
  })),
  withComputed(({ stats, _translateService }) => ({
    groupedCategories: computed(() => {
      const lang = _translateService.getCurrentLang();
      const groups = new Map<
        string,
        {
          group: ProductCategoryGroup;
          categories: (ProductCategoryStats & { productCount: number })[];
        }
      >();

      stats().forEach(stat => {
        const groupName =
          typeof stat.groupName === 'string' ? stat.groupName : stat.groupName[lang];
        if (!groups.has(groupName)) {
          groups.set(groupName, {
            group: { id: groupName, name: stat.groupName } as ProductCategoryGroup,
            categories: [],
          });
        }
        groups.get(groupName)?.categories.push({
          ...stat,
          productCount: stat.totalProducts,
        });
      });

      return Array.from(groups.values());
    }),
    totalProducts: computed(() => {
      return stats().reduce((acc, stat) => acc + stat.totalProducts, 0);
    }),
  })),
  withMethods(store => {
    const showErrorNotification = (error: ClientResponseError): void => {
      store._notification.show({
        type: 'ERROR',
        message: error.message ?? `product-categories.fullList.error`,
        action: 'notification.close-short',
        duration: 5000,
      });
    };

    const getLocalizedCategoryName = (category: ProductCategory): string => {
      const name: string | LocalizedFields<string> | undefined = category.name;
      if (!name) {
        return store._translateService.instant('products.all');
      }
      if (typeof name === 'string') {
        return name;
      }
      const currentLang: string = store._translateService.getCurrentLang();
      const localizedName: string | undefined =
        name[currentLang as keyof LocalizedFields<string>] ?? name['ca'];
      if (!localizedName) {
        return store._translateService.instant('products.all');
      }
      return localizedName;
    };

    return {
      getStats: rxMethod<void>(
        pipe(
          tap(() => updateState(store, '[product-categories] getStats')),
          switchMap(() =>
            store._statsService
              .getFullList({
                filter: `tenant = "${store._tenantStore.tenant()?.id}"`,
                sort: 'normalizedName',
              })
              .pipe(
                tapResponse<ProductCategoryStats[], ClientResponseError>({
                  next: stats => {
                    updateState(store, '[product-categories] getStats success', {
                      stats,
                      initiallyLoaded: true,
                    });
                  },
                  error: error => showErrorNotification(error),
                })
              )
          )
        )
      ),

      findCategoryBySlug(slug: string | null): ProductCategoryStats | undefined {
        return store.stats().find(item => item.normalizedName === slug);
      },

      getLocalizedCategoryName(category: ProductCategory): string {
        return getLocalizedCategoryName(category);
      },
    };
  }),
  withMethods(store => {
    const translateService = inject(TranslateService);
    const defaultIcon = inject(ALL_PRODUCTS_ICON);

    return {
      getCategoryBySlug(
        slug: string | null,
        defaultText: string
      ): Pick<ProductCategory, 'icon'> & {
        name: string;
      } {
        const category = store.findCategoryBySlug(slug);

        if (!slug || !category) {
          return {
            name: translateService.instant(defaultText),
            icon: defaultIcon,
          };
        }
        return {
          name: store.getLocalizedCategoryName(category),
          icon: category.icon,
        };
      },
    };
  }),
  withHooks({
    onInit(store) {
      if (!store.initiallyLoaded() && store._tenantStore.loaded()) {
        store.getStats();
      }
    },
  })
);
