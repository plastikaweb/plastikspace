import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { filter, map, Observable, of } from 'rxjs';

export const OrderListDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const orderListStore = inject(LLecoopOrderListStore);
  const id = route.paramMap.get('order-list-id');

  orderListStore.setSelectedItemUserOrderId(null);

  if (!id) {
    orderListStore.setSelectedItemId(null);
    return new RedirectCommand(router.parseUrl('/admin/comanda'));
  }

  orderListStore.setSelectedItemId(id);

  return toObservable(orderListStore.selectedItem).pipe(
    map(orderList => {
      if (!orderList?.orders) {
        orderListStore.getAllOrderListOrders(id);
      }
      return (
        !!orderList?.orders && (orderList?.orderCount ?? 0) === (orderList?.orders?.length ?? 0)
      );
    }),
    filter(Boolean)
  );
};
