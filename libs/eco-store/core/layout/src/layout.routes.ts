import { IMAGE_LOADER } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, importProvidersFrom, inject, LOCALE_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Route } from '@angular/router';

import { EnvironmentPocketBase, POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { pocketBaseStorageLoader } from '@plastik/storage/data-access';
import LayoutComponent from './layout.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlService } from '@plastik/core/paginator';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { EcoStoreCategoryRouteTitleService } from './eco-store-category-route-title.service';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';

const getEnvironment = (): EnvironmentPocketBase => inject(POCKETBASE_ENVIRONMENT);

export const layoutRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    providers: [
      {
        provide: MAT_ICON_DEFAULT_OPTIONS,
        useValue: { fontSet: 'material-symbols-outlined' },
      },
      { provide: LOCALE_ID, useValue: 'ca' },
      {
        provide: DEFAULT_CURRENCY_CODE,
        useValue: 'EUR',
      },
      {
        provide: IMAGE_LOADER,
        useFactory: () => pocketBaseStorageLoader(getEnvironment().baseApiUrl),
      },
      {
        provide: MatPaginatorIntl,
        useClass: MatPaginatorIntlService,
      },
      importProvidersFrom(EcoStoreFormlyModule),
    ],
    children: [
      {
        path: 'cistella',
        title: 'cart.title',
        loadChildren: () => import('@plastik/eco-store/cart').then(m => m.ecoStoreCartRoutes),
      },
      {
        path: 'botiga/:category/:slug',
        title: (route: ActivatedRouteSnapshot) =>
          inject(EcoStoreCategoryRouteTitleService).resolve(route),
        loadChildren: () =>
          import('@plastik/eco-store/product').then(m => m.ecoStoreProductFeatureRoutes),
      },
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
