import { filter, map, Observable } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';

import { llecoopUserOrderStore } from './user-order-store';

export const userOrderDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const store = inject(llecoopUserOrderStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return new RedirectCommand(router.parseUrl('/comandes'));
  }

  store.setSelectedItemId(id);

  return toObservable(store.selectedItem).pipe(
    map(userOrder => {
      if (!userOrder) {
        store.getItem(id);
      }
      return !!userOrder;
    }),
    filter(Boolean)
  );
};
