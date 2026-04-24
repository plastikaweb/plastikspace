import { Route } from '@angular/router';
import { EcoStoreOrdersDetailComponent } from './eco-store-orders-detail.component';
import { ecoStoreOrdersDetailResolver } from './eco-store-orders-detail.resolver';

export const ecoStoreOrdersDetailRoutes: Route[] = [
  {
    path: '',
    component: EcoStoreOrdersDetailComponent,
    resolve: { order: ecoStoreOrdersDetailResolver },
  },
];
