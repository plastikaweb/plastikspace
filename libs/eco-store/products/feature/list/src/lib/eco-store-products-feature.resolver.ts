// eco-store-products.resolver.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { activityStore } from '@plastik/shared/activity/data-access';

export const ecoStoreProductsResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const productStore = inject(ecoStoreProductsStore);
  const categoriesStore = inject(ecoStoreProductCategoriesStore);
  const loadingStore = inject(activityStore);
  const queryParams = route.queryParams;

  const categorySlug = route.paramMap.get('category') ?? null;
  const categoryObj = categoriesStore.findCategoryBySlug(categorySlug);

  loadingStore.setActivity(true); // set activity on immediate load
  productStore.enableListLoading();
  productStore.setParams({
    ...queryParams,
    category: categoryObj?.id ?? null,
  });

  return Promise.resolve(true);
};
