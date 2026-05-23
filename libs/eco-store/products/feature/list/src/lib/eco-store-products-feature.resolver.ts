import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { filter, map, Observable, take } from 'rxjs';

export const ecoStoreProductsResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const productStore = inject(ecoStoreProductsStore);
  const categoriesStore = inject(ecoStoreProductCategoriesStore);
  const queryParams = route.queryParams;

  const categorySlug = route.paramMap.get('category') ?? null;
  const categoryObj = categoriesStore.findCategoryBySlug(categorySlug);

  // Start products loading immediately
  productStore.setParams({
    ...queryParams,
    ...(categoryObj ? { category: categoryObj.category } : {}),
  });

  return toObservable(categoriesStore.isLoading).pipe(
    filter(isLoading => !isLoading),
    take(1),
    map(() => true)
  );
};
