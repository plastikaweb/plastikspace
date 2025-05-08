import { Route } from '@angular/router';

import { LlecoopOrderListFeatureListComponent } from './order-list-feature-list.component/llecoop-order-list-feature-list.component';
import { orderListFeatureListResolver } from './order-list-feature-list.resolver';

export const llecoopOrderListFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Llista de comandes per setmana',
    component: LlecoopOrderListFeatureListComponent,
    resolve: {
      listOrderListStore: orderListFeatureListResolver,
    },
    runGuardsAndResolvers: 'always',
  },
];
