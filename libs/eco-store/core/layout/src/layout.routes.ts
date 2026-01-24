import { IMAGE_LOADER } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Route } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { EnvironmentPocketBase, POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { MatPaginatorIntlService } from '@plastik/core/paginator';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { pocketBaseStorageLoader } from '@plastik/storage/data-access';
import { EcoStoreCategoryRouteTitleService } from './eco-store-category-route-title.service';
import LayoutComponent from './layout.component';

const getEnvironment = (): EnvironmentPocketBase => inject(POCKETBASE_ENVIRONMENT);

export const layoutRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    providers: [
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline' },
      },
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
      {
        provide: MAT_ICON_DEFAULT_OPTIONS,
        useValue: { fontSet: 'material-symbols-outlined' },
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
