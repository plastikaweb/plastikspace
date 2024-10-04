import { Route } from '@angular/router';
import { LlecoopOrderListFeatureListComponent } from './llecoop-order-list-feature-list/llecoop-order-list-feature-list.component';

export const llecoopOrderListFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Llista de comandes setmanals',
    component: LlecoopOrderListFeatureListComponent,
  },
];
