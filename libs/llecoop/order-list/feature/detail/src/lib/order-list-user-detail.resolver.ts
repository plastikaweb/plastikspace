import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { filter, map, Observable } from 'rxjs';

export const OrderListUserDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const orderListStore = inject(LLecoopOrderListStore);
  const userOrderId = route.paramMap.get('order-user-id');
  const orderListId = route.paramMap.get('order-list-id');

  if (!userOrderId || !orderListId) {
    orderListStore.setSelectedItemId(null);
    orderListStore.setSelectedItemUserOrderId(null);
    return new RedirectCommand(router.parseUrl('/admin/comanda'));
  }

  orderListStore.setSelectedItemId(orderListId);
  orderListStore.setSelectedItemUserOrderId(userOrderId);

  return toObservable(orderListStore.selectedItem).pipe(
    map(orderList => {
      if (!orderList?.orders) {
        orderListStore.getAllOrderListOrders(orderListId);
      }
      return (
        !!orderList?.orders &&
        (orderList?.orderCount ?? 0) === (orderList?.orders?.length ?? 0) &&
        !!orderListStore.selectedItemUserOrder()
      );
    }),
    filter(Boolean)
  );
};
