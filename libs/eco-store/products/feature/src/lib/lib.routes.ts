import { Route } from '@angular/router';

import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import {
  POCKETBASE_GET_STORE_TOKEN,
  pocketBaseListResolver,
} from '@plastik/signal-state/pocketbase';

export const ecoStoreProductsFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'store.list',
    providers: [
      {
        provide: POCKETBASE_GET_STORE_TOKEN,
        useExisting: ecoStoreProductsStore,
      },
    ],
    resolve: {
      productListLoaded: pocketBaseListResolver,
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./eco-store-products-feature.component'),
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: '',
        outlet: 'sidenav',
        loadComponent: () => import('./eco-store-products-sidenav-feature.component'),
      },
    ],
  },
];
