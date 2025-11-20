import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';

export const ecoStoreProductsFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'store.list',
    canActivate: [
      () => {
        inject(ecoStoreProductsStore);
        return true;
      },
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./eco-store-products-feature'),
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: '',
        outlet: 'sidenav',
        loadComponent: () => import('./eco-store-products-sidenav-feature'),
      },
    ],
  },
];
