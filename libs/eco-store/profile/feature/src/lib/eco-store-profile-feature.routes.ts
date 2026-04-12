import { Route } from '@angular/router';
import { providePlainInputFormly } from '@plastik/shared/form/util';

export const ecoStoreProfileFeatureRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./eco-store-profile-feature/eco-store-profile-feature.component').then(
            m => m.EcoStoreProfileFeatureComponent
          ),
        children: [
          {
            path: 'dades-personals',
            title: 'profile.personalData.title',
            data: {
              hasSidenav: true,
              title: 'profile.personalData.title',
              icon: 'badge',
              preferUserName: true,
            },
            providers: [providePlainInputFormly()],
            loadChildren: () =>
              import('@plastik/eco-store/profile/basic').then(
                m => m.ecoStoreProfileBasicFeatureRoutes
              ),
          },
          {
            path: 'avatar',
            title: 'profile.avatar.title',
            data: {
              hasSidenav: true,
              title: 'profile.avatar.title',
              icon: 'account_circle',
              preferUserName: true,
            },
            loadChildren: () =>
              import('@plastik/eco-store/profile/avatar').then(
                m => m.ecoStoreProfileAvatarFeatureRoutes
              ),
          },
          {
            path: 'adreces',
            title: 'profile.addresses.title',
            data: {
              hasSidenav: true,
              title: 'profile.addresses.title',
              icon: 'location_on',
              preferUserName: true,
            },
            loadChildren: () =>
              import('@plastik/eco-store/profile/addresses').then(
                m => m.ecoStoreProfileAddressesFeatureRoutes
              ),
          },
          {
            path: '**',
            redirectTo: 'dades-personals',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        outlet: 'sidenav',
        loadComponent: () =>
          import('./eco-store-profile-feature/eco-store-profile-sidenav-feature.component').then(
            m => m.EcoStoreProfileSidenavFeatureComponent
          ),
      },
    ],
  },
];
