import { updateState, withDevtools, withImmutableState } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject, untracked } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
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
  initiallyLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductCategoriesState = {
  initiallyLoaded: false,
  isLoading: false,
  error: null,
};

export const ecoStoreProductCategoriesStore = signalStore(
  { providedIn: 'root' },
  withDevtools('productsCategories'),
  withImmutableState<ProductCategoriesState>(initialState),
  withEntities<ProductCategoryStats>(),
  withProps(() => ({
    _statsService: inject(EcoStoreProductCategoriesStatsService),
    _notification: inject(notificationStore),
    _translateService: inject(TranslateService),
    _tenantStore: inject(ecoStoreTenantStore),
  })),
  withComputed(({ entities, _translateService }) => ({
    stats: entities,
    groupedCategories: computed(() => {
      const lang = _translateService.getCurrentLang();
      const groups = new Map<
        string,
        {
          group: ProductCategoryGroup;
          categories: (ProductCategoryStats & { productCount: number })[];
        }
      >();

      entities().forEach(stat => {
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
      return entities().reduce((acc, stat) => acc + stat.totalProducts, 0);
    }),
  })),
  withMethods(store => {
    const showErrorNotification = (error: ClientResponseError): void => {
      store._notification.show({
        type: 'ERROR',
        message: error.message ?? `products.categories.error`,
        action: 'common.notification.close',
        duration: 5000,
      });
    };

    const getLocalizedCategoryName = (category: ProductCategory | ProductCategoryStats): string => {
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
          tap(() =>
            updateState(store, '[product-categories] getStats', { isLoading: true, error: null })
          ),
          switchMap(() =>
            store._statsService
              .getFullList({
                filter: `tenant = "${store._tenantStore.tenant()?.id}"`,
                sort: 'normalizedName',
              })
              .pipe(
                tapResponse<ProductCategoryStats[], ClientResponseError>({
                  next: stats => {
                    updateState(
                      store,
                      '[product-categories] getStats success',
                      setAllEntities(stats, {
                        selectId: (entity: ProductCategoryStats) => entity.category,
                      }),
                      {
                        initiallyLoaded: true,
                        isLoading: false,
                      }
                    );
                  },
                  error: error => {
                    const message = error.message ?? `products.categories.error`;
                    updateState(store, '[product-categories] getStats error', {
                      isLoading: false,
                      error: message,
                    });
                    showErrorNotification(error);
                  },
                })
              )
          )
        )
      ),

      findCategoryBySlug(slug: string | null): ProductCategoryStats | undefined {
        return store.entities().find(item => item.normalizedName === slug);
      },

      getLocalizedCategoryName(category: ProductCategory | ProductCategoryStats): string {
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
      effect(() => {
        const tenantLoaded = store._tenantStore.loaded();
        const initiallyLoaded = store.initiallyLoaded();
        if (tenantLoaded && !initiallyLoaded) {
          untracked(() => store.getStats());
        }
      });
    },
  })
);
