import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
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
        provide: STORE_TOKEN,
        useExisting: LLecoopOrderListStore,
      },
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
  },
];
