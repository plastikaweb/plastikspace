import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, filter, first, map } from 'rxjs';

export const cartShippingResolver: ResolveFn<boolean> = () => {
  const userProfileStore = inject(pocketBaseUserProfileStore);
  const tenantStore = inject(ecoStoreTenantStore);
  userProfileStore.getUserAddresses();
  tenantStore.getTenantAddresses();
  const userAddressesLoaded = toObservable(userProfileStore.addressesLoaded);
  const tenantAddressesLoaded = toObservable(tenantStore.addressesLoaded);

  return combineLatest([userAddressesLoaded, tenantAddressesLoaded]).pipe(
    filter(([userLoaded, tenantLoaded]) => userLoaded && tenantLoaded),
    map(() => true),
    first()
  );
};
