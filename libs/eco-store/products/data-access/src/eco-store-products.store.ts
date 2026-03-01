import { updateState } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { setEntity } from '@ngrx/signals/entities';
import { TranslateService } from '@ngx-translate/core';
import { IdType, LocalizedFields } from '@plastik/core/entities';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import {
  EcoStoreProduct,
  EcoStoreProductWithCategoryName as EcoStoreProductWithTranslatedText,
  ProductCategory,
  ProductCategoryStats,
} from '@plastik/eco-store/entities';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import {
  initialGetListState,
  PocketBaseGetListState,
  withPocketBaseGet,
} from '@plastik/signal-state/pocketbase';
import { firstValueFrom } from 'rxjs';

import { EcoStoreProductsApiService } from './eco-store-products-api.service';

export interface ProductesPocketBaseGetListState extends PocketBaseGetListState {
  filter: { category: IdType<ProductCategory> | null };
}

export const ecoStoreProductsStore = signalStore(
  { providedIn: 'root' },
  withPocketBaseGet<EcoStoreProduct, EcoStoreProductsApiService, ProductesPocketBaseGetListState>({
    featureName: 'products',
    dataServiceType: EcoStoreProductsApiService,
    autoLoad: false,
    customInitialState: {
      paginationSizeOptions: [20, 50, 75],
      pagination: {
        page: 1,
        perPage: 20,
      },
      filter: {
        category: null,
      },
      sortOptions: {
        ...initialGetListState().sortOptions,
        priceWithIva: [
          { id: 3, direction: 'desc', icon: 'arrow_downward' },
          { id: 4, direction: 'asc', icon: 'arrow_upward' },
        ],
      },
      apiRequestDebounceTime: 0,
    },
  }),

  withComputed(({ entities }) => {
    const categoriesStore = inject(ecoStoreProductCategoriesStore);
    const translateService = inject(TranslateService);
    const environment = inject(POCKETBASE_WITH_TRANSLATION_ENVIRONMENT);

    return {
      productsWithTranslatedText: computed<EcoStoreProductWithTranslatedText[]>(() => {
        const products = entities();
        const categories = categoriesStore.stats();
        const currentLang = translateService.getCurrentLang() || environment.defaultLanguage;

        return products.map(product => {
          const category = categories.find(
            cat => cat.category === product.category
          ) as ProductCategoryStats;

          let categoryName = '';
          if (category && category.name && typeof category.name === 'object') {
            const nameObj = category.name as LocalizedFields<string>;
            categoryName = nameObj[currentLang] || '';
          }

          let productName = '';
          if (product.name && typeof product.name === 'object') {
            const nameObj = product.name as LocalizedFields<string>;
            productName = nameObj[currentLang] || '';
          } else if (typeof product.name === 'string') {
            productName = product.name;
          }

          let productDescription = '';
          if (product.description && typeof product.description === 'object') {
            const descriptionObj = product.description as LocalizedFields<string>;
            productDescription = descriptionObj[currentLang] || '';
          } else if (typeof product.description === 'string') {
            productDescription = product.description;
          }

          let productFeatures: string[] = [];
          if (product.features) {
            const featuresObj = product.features as LocalizedFields[];
            productFeatures = featuresObj.map(feature => {
              if (typeof feature === 'object') {
                return feature[currentLang] || '';
              }
              return feature;
            });
          }

          return {
            ...product,
            name: productName,
            description: productDescription,
            features: productFeatures,
            categoryName,
            categorySlug: category?.normalizedName || '',
            categoryColor: category?.color || '',
            categoryIcon: category?.icon || '',
          };
        });
      }),
    };
  }),
  withMethods(store => ({
    setSelectedFromSlug(slug: EcoStoreProductWithTranslatedText['categorySlug']): boolean {
      const product = store.entities().find(p => p.normalizedName === slug);
      if (product) {
        updateState(store, '[products] setSelectedFromSlug', { selectedItemId: product.id });
        return true;
      }
      return false;
    },

    async loadProductBySlug(
      slug: EcoStoreProductWithTranslatedText['categorySlug']
    ): Promise<EcoStoreProduct> {
      const product = await firstValueFrom(store._apiService.getOneBySlug(slug));

      if (!product) {
        throw new Error('Product not found');
      }

      updateState(
        store,
        '[products] loadProductBySlug',
        setEntity(product, {
          selectId: (entity: EcoStoreProduct) => entity.id || '',
        }),
        { selectedItemId: product.id }
      );

      return product;
    },
  }))
);
