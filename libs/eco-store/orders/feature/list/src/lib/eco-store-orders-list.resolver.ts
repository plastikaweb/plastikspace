import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';

export const ecoStoreOrdersListResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const ordersStore = inject(ecoStoreOrdersStore);
  const queryParams = route.queryParams;

  ordersStore.setParams({
    ...queryParams,
  });

  return true;
};
