import { Route } from '@angular/router';
import { EcoStoreProfileBasicFeatureComponent } from './eco-store-profile-basic-feature/eco-store-profile-basic-feature.component';

export const ecoStoreProfileBasicFeatureRoutes: Route[] = [
  {
    path: '',
    data: { hasSidenav: true, title: 'profile.personalData.title', icon: 'badge' },
    component: EcoStoreProfileBasicFeatureComponent,
  },
];
