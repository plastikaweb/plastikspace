import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { combineLatest, filter, map, Observable, take } from 'rxjs';

export const emptyCartGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const cartStore = inject(ecoStoreCartStore);
  const router = inject(Router);

  const isEmpty$ = toObservable(cartStore.isEmpty);
  const isSynced$ = toObservable(cartStore.isSynced);
  const isSyncing$ = toObservable(cartStore.isSyncing);

  return combineLatest({
    isEmpty: isEmpty$,
    isSynced: isSynced$,
    isSyncing: isSyncing$,
  }).pipe(
    filter(({ isSynced, isSyncing }) => isSynced || !isSyncing),
    take(1),
    map(({ isEmpty }) => {
      if (isEmpty) {
        return router.createUrlTree(['/botiga']);
      }
      return true;
    })
  );
};
