import { Route } from '@angular/router';

import { llecoopUserOrderProductListFeatureResolver } from './llecoop-user-order-product-list-feature.resolver';
import { LlecoopUserOrderProductListFeatureComponent } from './llecoop-user-order-product-list-feature/llecoop-user-order-product-list-feature.component';

export const llecoopUserOrderProductListFeatureRoutes: Route[] = [
  {
    path: '',
    component: LlecoopUserOrderProductListFeatureComponent,
    resolve: {
      allProducts: llecoopUserOrderProductListFeatureResolver,
    },
    runGuardsAndResolvers: 'always',
  },
];
