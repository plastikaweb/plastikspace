import { Route } from '@angular/router';

import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { POCKETBASE_GET_STORE_TOKEN } from '@plastik/signal-state/pocketbase';
import { ecoStoreProductsResolver } from './eco-store-products-feature.resolver';

export const ecoStoreProductsFeatureRoutes: Route[] = [
  {
    path: '',
    providers: [
      {
        provide: POCKETBASE_GET_STORE_TOKEN,
        useExisting: ecoStoreProductsStore,
      },
    ],
    children: [
      {
        path: '',
        resolve: {
          products: ecoStoreProductsResolver,
        },
        loadComponent: () => import('./eco-store-products-feature.component'),
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: '',
        outlet: 'sidenav',
        loadComponent: () => import('./eco-store-products-sidenav-feature.component'),
      },
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];
