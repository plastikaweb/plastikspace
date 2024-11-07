import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { Observable, of } from 'rxjs';

export const OrderListDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const store = inject(LLecoopOrderListStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return of(false);
  }
  store.getAllOrderListOrders(id);
  store.setSelectedItemId(id);

  return of(true);
};
