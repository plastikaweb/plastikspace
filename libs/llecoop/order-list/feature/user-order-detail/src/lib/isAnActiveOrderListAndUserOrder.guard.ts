import { filter, map } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

export const isAnActiveOrderListAndUserOrderGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const userOrderStore = inject(LlecoopUserOrderStore);
  const orderListStore = inject(llecoopOrderListStore);
  const id = route.paramMap.get('id');
  const userOrderId = userOrderStore
    .entities()
    .find(
      (entity: LlecoopUserOrder) =>
        entity.orderListId === orderListStore.currentOrderList()?.id && id === entity.id
    )?.id;

  return toObservable(userOrderStore.initiallyLoaded).pipe(
    filter(Boolean),
    map(() => {
      if (userOrderId) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/soci/comanda'));
    })
  );
};
