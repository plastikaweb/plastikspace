import { inject, Injector } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { filter, switchMap, take, tap } from 'rxjs';

export const ecoStoreProductsResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const productStore = inject(ecoStoreProductsStore);
  const categoriesStore = inject(ecoStoreProductCategoriesStore);
  const injector = inject(Injector);
  const queryParams = route.queryParams;

  const categorySlug = route.paramMap.get('category') ?? null;

  return toObservable(categoriesStore.initiallyLoaded, { injector }).pipe(
    filter(Boolean),
    take(1),
    tap(() => {
      const categoryObj = categoriesStore.findCategoryBySlug(categorySlug);

      productStore.enableListLoading();
      productStore.setParams({
        ...queryParams,
        category: categoryObj?.category ?? null,
      });
    }),
    switchMap(() => {
      return toObservable(productStore.initiallyLoaded, { injector }).pipe(
        filter(Boolean),
        take(1)
      );
    })
  );
};
