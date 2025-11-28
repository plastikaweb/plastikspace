// eco-store-products.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';

export const getProductsListResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const store = inject(ecoStoreProductsStore);
  const { page, perPage, sort, direction, ...filter } = route.queryParams;
  const sorting = {
    sort,
    direction,
  };
  const pagination = {
    page,
    perPage,
  };
  store.setParams(pagination, filter, sorting);

  return Promise.resolve(true);
};
