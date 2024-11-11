import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { OrderListFeatureListResolver } from './order-list-feature-list.resolver';
import { getLlecoopOrderListSearchFeatureFormConfig } from './order-list-feature-search-form.config';
import { LlecoopOrderListSearchFeatureTableConfig } from './order-list-feature-table.config';
import { LlecoopOrderListListFacadeService } from './order-list-list-facade.service';

export const llecoopOrderListFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Llista de comandes',
    component: TableWithFilteringComponent,
    providers: [
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: LlecoopOrderListListFacadeService,
      },
      {
        provide: TABLE_TOKEN,
        useExisting: LlecoopOrderListSearchFeatureTableConfig,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopOrderListSearchFeatureFormConfig(),
      },
    ],
    resolve: {
      unsetOrder: OrderListFeatureListResolver,
    },
  },
];
