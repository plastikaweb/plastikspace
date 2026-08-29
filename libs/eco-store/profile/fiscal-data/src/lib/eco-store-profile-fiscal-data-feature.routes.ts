import { inject } from '@angular/core';
import { ResolveFn, Route } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

import { EcoStoreProfileFiscalDataFeatureComponent } from './eco-store-profile-fiscal-data-feature/eco-store-profile-fiscal-data-feature.component';

const fiscalProfileResolver: ResolveFn<boolean> = async () => {
  const profileStore = inject(pocketBaseUserProfileStore);

  if (!profileStore.fiscalProfileLoaded()) {
    await profileStore.getFiscalProfile();
  }

  return true;
};

export const ecoStoreProfileFiscalDataFeatureRoutes: Route[] = [
  {
    path: '',
    data: { hasSidenav: true, title: 'profile.fiscalData.title', icon: 'receipt_long' },
    resolve: { loaded: fiscalProfileResolver },
    component: EcoStoreProfileFiscalDataFeatureComponent,
  },
];
