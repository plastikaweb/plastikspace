import { Route } from '@angular/router';
import { OrderListDetailResolver } from './order-list-detail.resolver';
import { LlecoopOrderListFeatureDetailComponent } from './order-list-feature-detail.component/llecoop-order-list-feature-detail.component';

export const llecoopOrderListFeatureDetailRoutes: Route[] = [
  {
    path: '',
    title: 'Detall de la comanda',
    component: LlecoopOrderListFeatureDetailComponent,
    resolve: {
      order: OrderListDetailResolver,
    },
    runGuardsAndResolvers: 'always',
  },
];
