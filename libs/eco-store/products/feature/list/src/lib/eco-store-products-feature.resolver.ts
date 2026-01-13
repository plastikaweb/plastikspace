// eco-store-products.resolver.ts
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { activityStore } from '@plastik/shared/activity/data-access';
import { filter, map, take, tap } from 'rxjs';

export const ecoStoreProductsResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const productStore = inject(ecoStoreProductsStore);
  const categoriesStore = inject(ecoStoreProductCategoriesStore);
  const loadingStore = inject(activityStore);
  const queryParams = route.queryParams;

  const categorySlug = route.paramMap.get('category') ?? null;

  return toObservable(categoriesStore.initiallyLoaded).pipe(
    filter(Boolean),
    take(1),
    tap(() => {
      const categoryObj = categoriesStore.findCategoryBySlug(categorySlug);

      loadingStore.setActivity(true);
      productStore.enableListLoading();
      productStore.setParams({
        ...queryParams,
        category: categoryObj?.id ?? null,
      });
    }),
    map(() => true)
  );
};
