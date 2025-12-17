// eco-store-products.resolver.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';

export const ecoStoreProductsResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const productStore = inject(ecoStoreProductsStore);
  const categoriesStore = inject(ecoStoreProductCategoriesStore);
  const queryParams = route.queryParams;

  const categorySlug = route.paramMap.get('category') ?? null;
  const categoryObj = categoriesStore.findCategoryBySlug(categorySlug);

  productStore.enableListLoading();
  productStore.setParams({
    ...queryParams,
    category: categoryObj?.id ?? null,
  });

  return Promise.resolve(true);
};
