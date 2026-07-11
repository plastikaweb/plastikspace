import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { combineLatest, filter, map, Observable, take } from 'rxjs';

export const emptyCartGuard: CanActivateFn = (): Observable<boolean | UrlTree> | boolean => {
  // During SSR the cart is unknowable: localStorage and the auth token live only in the
  // browser, so server-side the store always reads empty and the guard would bounce valid
  // deep-links (e.g. /cistella/resum with items) to /botiga. Defer the decision to the
  // client, which re-runs the guard once the cart has hydrated. BUG-002.
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }

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
