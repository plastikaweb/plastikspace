import { filter, map, Observable } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';

export const orderListFeatureDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const store = inject(llecoopOrderListStore);
  const id = route.paramMap.get('order-list-id');

  store.setSelectedItemUserOrderId(null);

  if (!id) {
    store.setSelectedItemId(null);
    return new RedirectCommand(router.parseUrl('/admin/comanda'));
  }

  store.setSelectedItemId(id);

  return toObservable(store.selectedItem).pipe(
    map(orderList => {
      if (!orderList) {
        store.getItem(id);
      }
      return !!orderList;
    }),
    filter(Boolean)
  );
};
