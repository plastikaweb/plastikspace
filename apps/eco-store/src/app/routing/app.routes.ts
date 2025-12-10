import { DEFAULT_CURRENCY_CODE, importProvidersFrom, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ActivatedRouteSnapshot, Route } from '@angular/router';

import { MatPaginatorIntlService } from '@plastik/core/paginator';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { EcoStoreCategoryRouteTitleService } from './eco-store-category-route-title.service';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../layout/layout.component'),
    providers: [
      {
        provide: MatPaginatorIntl,
        useClass: MatPaginatorIntlService,
      },
      {
        provide: DEFAULT_CURRENCY_CODE,
        useValue: 'EUR',
      },
      importProvidersFrom(EcoStoreFormlyModule),
    ],
    children: [
      {
        path: 'botiga/:category',
        title: (route: ActivatedRouteSnapshot) =>
          inject(EcoStoreCategoryRouteTitleService).resolve(route),
        loadChildren: () =>
          import('@plastik/eco-store/products').then(m => m.ecoStoreProductsFeatureRoutes),
      },
      {
        path: 'botiga',
        title: 'products.all',
        loadChildren: () =>
          import('@plastik/eco-store/products').then(m => m.ecoStoreProductsFeatureRoutes),
      },
      {
        path: '**',
        redirectTo: 'botiga',
        pathMatch: 'full',
      },
    ],
  },
];
