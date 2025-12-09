import { computed, inject } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { LocalizedFields } from '@plastik/core/entities';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import {
  EcoStoreProduct,
  EcoStoreProductWithCategoryName,
  ProductCategory,
} from '@plastik/eco-store/entities';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { withPocketBaseGet } from '@plastik/signal-state/pocketbase';

import { EcoStoreProductsApiService } from './eco-store-products-api.service';

export const ecoStoreProductsStore = signalStore(
  { providedIn: 'root' },
  withPocketBaseGet<EcoStoreProduct, EcoStoreProductsApiService>({
    featureName: 'products',
    dataServiceType: EcoStoreProductsApiService,
    customInitialState: {
      paginationSizeOptions: [20, 50, 75],
      pagination: {
        page: 1,
        perPage: 20,
      },
    },
  }),

  withComputed(({ entities }) => {
    const categoriesStore = inject(ecoStoreProductCategoriesStore);
    const translateService = inject(TranslateService);
    const environment = inject(POCKETBASE_WITH_TRANSLATION_ENVIRONMENT);

    return {
      productsWithCategoryName: computed<EcoStoreProductWithCategoryName[]>(() => {
        const products = entities();
        const categories = categoriesStore.categories();
        const currentLang = translateService.getCurrentLang() || environment.defaultLanguage;

        return products.map(product => {
          const category = categories.find(cat => cat.id === product.category) as ProductCategory;

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

          return {
            ...product,
            name: productName,
            categoryName,
            categoryColor: category?.color || '',
          };
        });
      }),
    };
  })
);
