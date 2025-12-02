// eco-store-products.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { POCKETBASE_GET_STORE_TOKEN } from '../pocketbase-store-token';

export const pocketBaseListResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const store = inject(POCKETBASE_GET_STORE_TOKEN);
  store.setParams(route.queryParams);
  return Promise.resolve(true);
};
