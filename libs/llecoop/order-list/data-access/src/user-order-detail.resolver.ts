import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { LlecoopUserOrderStore } from './user-order-store';

export const UserOrderDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const store = inject(LlecoopUserOrderStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return new RedirectCommand(router.parseUrl('/soci/comanda'));
  }

  store.setSelectedItemId(id);

  return toObservable(store.selectedItem).pipe(
    map(userOrder => {
      if (!userOrder) {
        store.getAll();
      }
      return !!userOrder;
    }),
    filter(Boolean)
  );
};
