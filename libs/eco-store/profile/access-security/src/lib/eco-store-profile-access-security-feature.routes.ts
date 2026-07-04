import { Route } from '@angular/router';
import { EcoStoreProfileAccessSecurityFeatureComponent } from './eco-store-profile-access-security-feature/eco-store-profile-access-security-feature.component';

export const ecoStoreProfileAccessSecurityFeatureRoutes: Route[] = [
  {
    path: '',
    data: { hasSidenav: true, title: 'profile.accessSecurity.title', icon: 'security' },
    component: EcoStoreProfileAccessSecurityFeatureComponent,
  },
];
