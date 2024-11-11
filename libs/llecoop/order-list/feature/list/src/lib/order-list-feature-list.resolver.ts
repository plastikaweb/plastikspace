import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { Observable, of } from 'rxjs';

export const OrderListFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const store = inject(LLecoopOrderListStore);

  store.setSelectedItemId(null);

  return of(true);
};
