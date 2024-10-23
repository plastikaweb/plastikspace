import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

export const isAnActiveOrderListGuard = () => {
  const router = inject(Router);
  const orderStore = inject(LlecoopUserOrderStore);
  const orderListStore = inject(LLecoopOrderListStore);

  if (
    !orderStore
      .entities()
      .some(entity => entity['orderListId'] === orderListStore.currentOrder()?.id) &&
    orderListStore.entities().some(entity => entity.status === 'progress')
  ) {
    return true;
  }

  router.navigate(['/soci/comanda']);
  return false;
};
