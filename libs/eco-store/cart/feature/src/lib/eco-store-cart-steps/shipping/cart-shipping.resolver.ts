import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { combineLatest, filter, first, map } from 'rxjs';

export const cartShippingResolver: ResolveFn<boolean> = () => {
  const userProfileStore = inject(pocketBaseUserProfileStore);
  const tenantStore = inject(ecoStoreTenantStore);
  const cartStore = inject(ecoStoreCartStore);
  userProfileStore.getUserAddresses();
  tenantStore.getTenantAddresses();
  cartStore.loadAndMergeUserCart();
  const userAddressesLoaded = toObservable(userProfileStore.addressesLoaded);
  const tenantAddressesLoaded = toObservable(tenantStore.addressesLoaded);
  const cartLoaded = toObservable(cartStore.isSynced);

  return combineLatest([userAddressesLoaded, tenantAddressesLoaded, cartLoaded]).pipe(
    filter(([userLoaded, tenantLoaded, cartLoaded]) => userLoaded && tenantLoaded && cartLoaded),
    map(() => true),
    first()
  );
};
