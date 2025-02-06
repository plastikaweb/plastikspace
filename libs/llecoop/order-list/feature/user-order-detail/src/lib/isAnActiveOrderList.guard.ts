import { filter, map } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { LlecoopOrder, LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

export const isAnActiveOrderListGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userOrderStore = inject(LlecoopUserOrderStore);
  const orderListStore = inject(LLecoopOrderListStore);

  return toObservable(userOrderStore.loaded).pipe(
    filter(Boolean),
    map(() => {
      if (
        !userOrderStore
          .entities()
          .some(
            (entity: LlecoopUserOrder) =>
              entity['orderListId'] === orderListStore.currentOrder()?.id
          ) &&
        orderListStore.entities().some((entity: LlecoopOrder) => entity.status === 'progress')
      ) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/soci/comanda'));
    })
  );
};
