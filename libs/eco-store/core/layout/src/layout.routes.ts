import { DEFAULT_CURRENCY_CODE, importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Route } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlService } from '@plastik/core/paginator';
import { EcoStoreCategoryRouteTitleService } from '@plastik/eco-store/core/router-state';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import EcoLayoutComponent from './layout.component';

export const layoutRoutes: Route[] = [
  {
    path: '',
    component: EcoLayoutComponent,
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
        path: 'comanda',
        data: { hasSidenav: false },
        loadChildren: () =>
          import('@plastik/eco-store/orders/feature').then(m => m.ecoStoreOrderConfirmationRoutes),
      },
      {
        path: 'cistella',
        data: { hasSidenav: false },
        loadChildren: () => import('@plastik/eco-store/cart').then(m => m.ecoStoreCartRoutes),
      },
      {
        path: 'botiga/:category/:slug',
        title: (route: ActivatedRouteSnapshot) =>
          inject(EcoStoreCategoryRouteTitleService).resolve(route),
        data: { hasSidenav: false },
        loadChildren: () =>
          import('@plastik/eco-store/product').then(m => m.ecoStoreProductFeatureRoutes),
      },
      {
        path: 'botiga/:category',
        title: (route: ActivatedRouteSnapshot) =>
          inject(EcoStoreCategoryRouteTitleService).resolve(route),
        data: { hasSidenav: true },
        loadChildren: () =>
          import('@plastik/eco-store/products').then(m => m.ecoStoreProductsFeatureRoutes),
      },
      {
        path: 'botiga',
        title: 'products.all',
        data: { hasSidenav: true },
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
