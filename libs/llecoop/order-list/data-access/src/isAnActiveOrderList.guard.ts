import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LLecoopOrderListStore } from './order-list-store';
import { LlecoopOrderUserStore } from './order-user-store';

export const isAnActiveOrderListGuard = async () => {
  const router = inject(Router);
  const orderStore = inject(LlecoopOrderUserStore);
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
