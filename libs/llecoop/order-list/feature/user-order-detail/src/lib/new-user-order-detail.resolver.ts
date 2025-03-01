import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';

export const newUserOrderDetailResolver: ResolveFn<boolean> = () => {
  const store = inject(llecoopUserOrderStore);

  store.setSelectedItemId(null);

  return true;
};
