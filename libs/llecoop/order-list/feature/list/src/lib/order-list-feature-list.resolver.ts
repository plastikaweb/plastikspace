import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import {
  initOrderListStoreFilter,
  initOrderListStorePagination,
  initOrderListStoreSorting,
  llecoopOrderListStore,
} from '@plastik/llecoop/order-list/data-access';

export const orderListFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const orderListStore = inject(llecoopOrderListStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  orderListStore.setSelectedItemId(null);

  if (!previousUrl?.startsWith('/admin/comanda') || !orderListStore.initiallyLoaded()) {
    orderListStore.setSorting(initOrderListStoreSorting);
    orderListStore.setFilter(initOrderListStoreFilter);
    orderListStore.setPagination(initOrderListStorePagination);
    orderListStore.getAll();
    orderListStore.setCount();
  }

  return of(true);
};
