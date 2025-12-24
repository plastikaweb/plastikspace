import { Route } from '@angular/router';
import { ecoStoreProductResolver } from './eco-store-product-feature.resolver';
import { ecoStoreProductCanDeactivateGuard } from './eco-store-product-can-deactivate.guard';

export const ecoStoreProductFeatureRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./eco-store-product-feature.component'),
    resolve: { product: ecoStoreProductResolver },
    canDeactivate: [ecoStoreProductCanDeactivateGuard],
  },
];
