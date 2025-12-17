import { Route } from '@angular/router';
import { ecoStoreProductResolver } from './eco-store-product-feature.resolver';

export const ecoStoreProductFeatureRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./eco-store-product-feature.component'),
    resolve: { product: ecoStoreProductResolver },
  },
];
