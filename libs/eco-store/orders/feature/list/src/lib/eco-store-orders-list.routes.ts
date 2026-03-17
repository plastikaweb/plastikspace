import { Route } from '@angular/router';
import EcoStoreOrdersListComponent from './eco-store-orders-list.component';
import { ecoStoreOrdersListResolver } from './eco-store-orders-list.resolver';

export const ecoStoreOrdersListRoutes: Route[] = [
  {
    path: '',
    title: 'orders.list.title',
    component: EcoStoreOrdersListComponent,
    resolve: { ready: ecoStoreOrdersListResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];
