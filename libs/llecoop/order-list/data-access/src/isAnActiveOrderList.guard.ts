import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LLecoopOrderListStore } from './order-list-store';
import { LlecoopOrderStore } from './order-store';

export const isAnActiveOrderListGuard = async () => {
  const router = inject(Router);
  const orderStore = inject(LlecoopOrderStore);
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
