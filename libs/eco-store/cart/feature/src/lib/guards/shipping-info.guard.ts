import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { combineLatest, filter, map, Observable, take } from 'rxjs';

export const shippingInfoGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const cartStore = inject(ecoStoreCartStore);
  const tenantStore = inject(ecoStoreTenantStore);
  const router = inject(Router);

  if (!tenantStore.addressesLoaded()) {
    tenantStore.getTenantAddresses();
  }

  const isShippingOk$ = toObservable(cartStore.isShippingOk);
  const isSynced$ = toObservable(cartStore.isSynced);
  const isSyncing$ = toObservable(cartStore.isSyncing);
  const addressesLoaded$ = toObservable(tenantStore.addressesLoaded);

  return combineLatest({
    isShippingOk: isShippingOk$,
    isSynced: isSynced$,
    isSyncing: isSyncing$,
    addressesLoaded: addressesLoaded$,
  }).pipe(
    filter(
      ({ isSynced, isSyncing, addressesLoaded }) => (isSynced || !isSyncing) && addressesLoaded
    ),
    take(1),
    map(({ isShippingOk }) => {
      if (!isShippingOk) {
        return router.createUrlTree(['/cistella/enviament']);
      }
      return true;
    })
  );
};
