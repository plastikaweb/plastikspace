import { importProvidersFrom } from '@angular/core';
import { Route } from '@angular/router';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import EcoStoreOrdersListComponent from './eco-store-orders-list.component';
import { ecoStoreOrdersListResolver } from './eco-store-orders-list.resolver';

export const ecoStoreOrdersListRoutes: Route[] = [
  {
    path: '',
    title: 'orders.list.title',
    component: EcoStoreOrdersListComponent,
    providers: [importProvidersFrom(EcoStoreFormlyModule)],
    resolve: { ready: ecoStoreOrdersListResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];
