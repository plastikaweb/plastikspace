import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LlecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';

export const NewUserOrderDetailResolver: ResolveFn<boolean> = () => {
  const store = inject(LlecoopUserOrderStore);

  store.setSelectedItemId(null);

  return true;
};
