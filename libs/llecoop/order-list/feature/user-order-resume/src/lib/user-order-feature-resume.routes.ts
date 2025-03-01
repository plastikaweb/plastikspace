import { Route } from '@angular/router';
import { userOrderDetailResolver } from '@plastik/llecoop/order-list/data-access';

import { LlecoopUserOrderFeatureResumeComponent } from './llecoop-user-order-feature-resume/user-order-feature-resume.component';

export const llecoopUserOrderFeatureResumeRoutes: Route[] = [
  {
    path: '',
    title: 'Resum de la comanda',
    component: LlecoopUserOrderFeatureResumeComponent,
    resolve: {
      item: userOrderDetailResolver,
    },
  },
];
