import { Route } from '@angular/router';
import { canDeactivateGuard } from '@plastik/core/can-deactivate';

import { LlecoopOrderListFeatureDetailComponent } from './order-list-feature-detail.component/llecoop-order-list-feature-detail.component';
import { OrderListFeatureDetailResolver } from './order-list-feature-detail.resolver';

export const llecoopOrderListFeatureDetailRoutes: Route[] = [
  {
    path: '',
    title: 'Comandes de socis',
    component: LlecoopOrderListFeatureDetailComponent,
    canDeactivate: [canDeactivateGuard],
    resolve: {
      order: OrderListFeatureDetailResolver,
    },
  },
];
