import { DEFAULT_CURRENCY_CODE, ErrorHandler, importProvidersFrom } from '@angular/core';
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
      {
        provide: DEFAULT_CURRENCY_CODE,
        useValue: 'EUR',
      },
      importProvidersFrom(EcoStoreFormlyModule),
    ],
    children: [
      {
        path: 'botiga',
        loadChildren: () =>
          import('@plastik/eco-store/products').then(m => m.ecoStoreProductsFeatureRoutes),
      },
      {
        path: 'botiga/:category',
        loadChildren: () =>
          import('@plastik/eco-store/products').then(m => m.ecoStoreProductsFeatureRoutes),
      },
      {
        path: 'botiga',
        redirectTo: 'botiga/',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'botiga/',
        pathMatch: 'full',
      },
    ],
  },
];
