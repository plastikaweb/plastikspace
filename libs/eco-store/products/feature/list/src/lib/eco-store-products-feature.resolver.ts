import { inject, Injector } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { combineLatest, filter, map, take, tap } from 'rxjs';

export const ecoStoreProductsResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const productStore = inject(ecoStoreProductsStore);
  const categoriesStore = inject(ecoStoreProductCategoriesStore);
  const injector = inject(Injector);
  const queryParams = route.queryParams;

  const categorySlug = route.paramMap.get('category') ?? null;

  // Start products loading immediately in parallel with categories
  productStore.enableListLoading();
  productStore.setParams({
    ...queryParams,
    categorySlug,
  });

  return combineLatest([
    toObservable(categoriesStore.initiallyLoaded, { injector }).pipe(filter(Boolean)),
    toObservable(productStore.initiallyLoaded, { injector }).pipe(filter(Boolean)),
  ]).pipe(
    take(1),
    tap(() => {
      // Once categories are loaded, ensure the internal category filter is correctly mapped to ID
      // This is important for consistency in the store state
      const categoryObj = categoriesStore.findCategoryBySlug(categorySlug);
      if (categoryObj) {
        productStore.setParams({
          ...queryParams,
          category: categoryObj.category,
        });
      }
    }),
    map(() => true)
  );
};
