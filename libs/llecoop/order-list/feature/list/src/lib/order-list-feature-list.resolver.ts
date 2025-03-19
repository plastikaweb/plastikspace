import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import {
  llecoopOrderListStore,
  orderListMainInitState,
} from '@plastik/llecoop/order-list/data-access';

export const orderListFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const orderListStore = inject(llecoopOrderListStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  orderListStore.setSelectedItemId(null);
  orderListStore.setSelectedItemUserOrderId(null);
  orderListStore.setSelectedItemCartLoaded(false);

  if (!previousUrl?.startsWith('/admin/comanda') || !orderListStore.initiallyLoaded()) {
    orderListStore.resetTableConfig(
      orderListMainInitState.pagination,
      orderListMainInitState.filter,
      orderListMainInitState.sorting
    );
  }

  return of(true);
};
