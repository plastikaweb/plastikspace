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
  const categoryObj = categoriesStore.findCategoryBySlug(categorySlug);

  // Start products loading immediately
  productStore.setParams({
    ...queryParams,
    categorySlug,
    ...(categoryObj ? { category: categoryObj.category } : {}),
  });

  return combineLatest([
    toObservable(categoriesStore.initiallyLoaded, { injector }).pipe(filter(Boolean)),
    toObservable(productStore.initiallyLoaded, { injector }).pipe(filter(Boolean)),
  ]).pipe(
    take(1),
    tap(() => {
      // If we didn't have the category object before, try to set it now
      if (!categoryObj) {
        const categoryObjAfterLoad = categoriesStore.findCategoryBySlug(categorySlug);
        if (categoryObjAfterLoad) {
          productStore.setParams({
            ...queryParams,
            category: categoryObjAfterLoad.category,
          });
        }
      }
    }),
    map(() => true)
  );
};
