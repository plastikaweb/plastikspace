import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';

import { LlecoopOrderListUserOrderFeatureListFacadeService } from './order-list-user-order-feature-list-facade.service';
import { getLlecoopOrderListUserOrderFeatureListSearchFormConfig } from './order-list-user-order-feature-list-search-form.config';
import { LlecoopOrderListUserOrderFeatureListTableConfig } from './order-list-user-order-feature-list-table.config';
import { orderListUserOrderFeatureListResolver } from './order-list-user-order-feature-list.resolver';

export const llecoopOrderListUserOrdersListRoutes: Route[] = [
  {
    path: '',
    title: 'Totes les comandes',
    component: TableWithFilteringComponent,
    providers: [
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: LlecoopOrderListUserOrderFeatureListFacadeService,
      },
      {
        provide: TABLE_TOKEN,
        useExisting: LlecoopOrderListUserOrderFeatureListTableConfig,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopOrderListUserOrderFeatureListSearchFormConfig(),
      },
    ],
    resolve: {
      allOrders: orderListUserOrderFeatureListResolver,
    },
  },
];
