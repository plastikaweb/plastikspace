import { Route } from '@angular/router';
import { OrderListDetailResolver } from './order-list-detail.resolver';
import { LlecoopOrderListFeatureDetailComponent } from './order-list-feature-detail.component/llecoop-order-list-feature-detail.component';
import { OrderListUserDetailResolver } from './order-list-user-detail.resolver';

export const llecoopOrderListFeatureDetailRoutes: Route[] = [
  {
    path: '',
    title: 'Comandes de socis',
    component: LlecoopOrderListFeatureDetailComponent,
    resolve: {
      order: OrderListDetailResolver,
    },
  },
];

export const llecoopOrderListUserOrderFeatureDetailRoutes: Route[] = [
  {
    path: '',
    title: 'Detall de la comanda de soci',
    data: {
      reuse: true,
    },
    component: LlecoopOrderListFeatureDetailComponent,
    resolve: {
      userOrder: OrderListUserDetailResolver,
    },
  },
];
