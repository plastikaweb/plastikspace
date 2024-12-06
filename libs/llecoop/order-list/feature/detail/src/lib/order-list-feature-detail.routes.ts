import { Route } from '@angular/router';
import { canDeactivateGuard } from '@plastik/core/can-deactivate';
import { OrderListDetailResolver } from './order-list-detail.resolver';
import { LlecoopOrderListFeatureDetailComponent } from './order-list-feature-detail.component/llecoop-order-list-feature-detail.component';

export const llecoopOrderListFeatureDetailRoutes: Route[] = [
  {
    path: '',
    title: 'Comandes de socis',
    component: LlecoopOrderListFeatureDetailComponent,
    canDeactivate: [canDeactivateGuard],
    resolve: {
      order: OrderListDetailResolver,
    },
  },
];
