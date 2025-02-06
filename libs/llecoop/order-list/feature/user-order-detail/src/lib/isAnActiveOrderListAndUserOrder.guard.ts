import { filter, map } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

export const isAnActiveOrderListAndUserOrderGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const userOrderStore = inject(LlecoopUserOrderStore);
  const orderListStore = inject(LLecoopOrderListStore);
  const id = route.paramMap.get('id');
  const currentOrderListId = orderListStore.currentOrder()?.id;
  const userOrderId = userOrderStore
    .entities()
    .find(
      (entity: LlecoopUserOrder) => entity.orderListId === currentOrderListId && id === entity.id
    )?.id;

  return toObservable(userOrderStore.loaded).pipe(
    filter(Boolean),
    map(() => {
      if (userOrderId) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/soci/comanda'));
    })
  );
};
