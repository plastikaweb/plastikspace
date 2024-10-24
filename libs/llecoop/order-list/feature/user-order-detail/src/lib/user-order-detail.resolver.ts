import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LlecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';

export const UserOrderDetailResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot
): boolean => {
  const store = inject(LlecoopUserOrderStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return false;
  }

  store.setSelectedItemId(id);
  return true;
};
