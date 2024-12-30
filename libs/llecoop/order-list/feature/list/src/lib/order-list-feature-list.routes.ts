import { Route } from '@angular/router';

import { LlecoopOrderListFeatureListComponent } from './order-list-feature-list.component/llecoop-order-list-feature-list.component';
import { OrderListFeatureListResolver } from './order-list-feature-list.resolver';

export const llecoopOrderListFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Llista de comandes',
    component: LlecoopOrderListFeatureListComponent,
    resolve: {
      unsetOrder: OrderListFeatureListResolver,
    },
  },
];
