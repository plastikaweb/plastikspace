import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn, Route } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { filter, map, take } from 'rxjs';

import { EcoStoreProfileAddressesFeatureComponent } from './eco-store-profile-addresses-feature/eco-store-profile-addresses-feature.component';

const profileAddressesResolver: ResolveFn<boolean> = () => {
  const profileStore = inject(pocketBaseUserProfileStore);
  if (!profileStore.addressesLoaded()) {
    profileStore.getUserAddresses();
  }

  return toObservable(profileStore.addressesLoaded).pipe(
    filter(Boolean),
    take(1),
    map(() => true)
  );
};

export const ecoStoreProfileAddressesFeatureRoutes: Route[] = [
  {
    path: '',
    component: EcoStoreProfileAddressesFeatureComponent,
    resolve: { addressesLoaded: profileAddressesResolver },
  },
];
