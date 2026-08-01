import { Route } from '@angular/router';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { ecoStoreFiscalDataCanMatchGuard } from './eco-store-fiscal-data-can-match.guard';

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
            path: 'access-i-seguretat',
            title: 'profile.accessSecurity.title',
            data: {
              hasSidenav: true,
              title: 'profile.accessSecurity.title',
              icon: 'security',
              preferUserName: true,
            },
            // Formly providers live in the lib's own routes (provideFormlyCore + the
            // access-security validation messages must share one injector).
            loadChildren: () =>
              import('@plastik/eco-store/profile/access-security').then(
                m => m.ecoStoreProfileAccessSecurityFeatureRoutes
              ),
          },
          {
            path: 'dades-fiscals',
            title: 'profile.fiscalData.title',
            data: {
              hasSidenav: true,
              title: 'profile.fiscalData.title',
              icon: 'receipt_long',
              preferUserName: true,
            },
            canMatch: [ecoStoreFiscalDataCanMatchGuard],
            providers: [providePlainInputFormly()],
            loadChildren: () =>
              import('@plastik/eco-store/profile/fiscal-data').then(
                m => m.ecoStoreProfileFiscalDataFeatureRoutes
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
