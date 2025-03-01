import { combineLatest, filter, map } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

export const isAnActiveOrderListGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userOrderStore = inject(llecoopUserOrderStore);
  const orderListStore = inject(llecoopOrderListStore);

  const currentUserOrder = toObservable(userOrderStore.currentUserOrder);
  const currentOrderList = toObservable(orderListStore.currentOrderList);
  const currentOrderListInitialLoaded = toObservable(orderListStore.currentOrderListInitialLoaded);
  const currentUserOrderInitialLoaded = toObservable(userOrderStore.currentUserOrderInitialLoaded);

  return combineLatest([
    currentUserOrder,
    currentOrderList,
    currentOrderListInitialLoaded,
    currentUserOrderInitialLoaded,
  ]).pipe(
    filter(
      ([, , orderListInitialLoaded, currentUserOrderInitialLoaded]) =>
        orderListInitialLoaded && currentUserOrderInitialLoaded
    ),
    map(([currentUserOrder, currentOrderList]) => {
      if (!currentUserOrder && currentOrderList) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/soci/comanda'));
    })
  );
};
