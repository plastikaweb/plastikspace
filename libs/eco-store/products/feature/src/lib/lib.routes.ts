import { Route } from '@angular/router';

import { getProductsListResolver } from './eco-store-products-feature.resolver';

export const ecoStoreProductsFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'store.list',
    resolve: {
      productListLoaded: getProductsListResolver,
    },
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
