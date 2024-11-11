import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { filter, map } from 'rxjs';

export const isAnActiveOrderListAndUserOrderGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const userOrderStore = inject(LlecoopUserOrderStore);
  const orderListStore = inject(LLecoopOrderListStore);
  const id = route.paramMap.get('id');

  return toObservable(userOrderStore.loaded).pipe(
    filter(Boolean),
    map(() => {
      if (
        userOrderStore
          .entities()
          .some(entity => entity['orderListId'] === orderListStore.currentOrder()?.id) &&
        orderListStore.entities().some(entity => entity.status === 'progress') &&
        userOrderStore.openedOrder()?.id === id
      ) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/soci/comanda'));
    })
  );
};
