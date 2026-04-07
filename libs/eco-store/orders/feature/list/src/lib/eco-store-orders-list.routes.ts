import { Route } from '@angular/router';
import { provideInputSearchFormly } from '@plastik/shared/form/input-search';
import { provideEcoStoreOrdersFormly } from './eco-store-orders-formly.providers';
import EcoStoreOrdersListComponent from './eco-store-orders-list.component';
import { ecoStoreOrdersListResolver } from './eco-store-orders-list.resolver';

export const ecoStoreOrdersListRoutes: Route[] = [
  {
    path: '',
    title: 'orders.list.title',
    component: EcoStoreOrdersListComponent,
    providers: [provideEcoStoreOrdersFormly(), provideInputSearchFormly()],
    resolve: { ready: ecoStoreOrdersListResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];
