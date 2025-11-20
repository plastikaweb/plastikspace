import { ErrorHandler, importProvidersFrom } from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { Route, TitleStrategy } from '@angular/router';

import { PrefixTitleService } from '@plastik/core/router-state';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component'),
    providers: [
      {
        provide: MAT_ICON_DEFAULT_OPTIONS,
        useValue: { fontSet: 'material-symbols-outlined' },
      },
      {
        provide: ErrorHandler,
        useClass: ErrorHandlerService,
      },
      {
        provide: TitleStrategy,
        useClass: PrefixTitleService,
      },
      importProvidersFrom(EcoStoreFormlyModule),
    ],
    children: [
      {
        path: 'store',
        loadChildren: () =>
          import('@plastik/eco-store/products').then(m => m.ecoStoreProductsFeatureRoutes),
      },
      {
        path: 'store/:category',
        loadChildren: () =>
          import('@plastik/eco-store/products').then(m => m.ecoStoreProductsFeatureRoutes),
      },
      {
        path: '',
        redirectTo: 'store/',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'store/',
        pathMatch: 'full',
      },
    ],
  },
];
