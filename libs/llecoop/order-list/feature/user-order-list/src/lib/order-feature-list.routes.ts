import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LlecoopOrderUserStore } from '@plastik/llecoop/order-list/data-access';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { LlecoopOrderListFacadeService } from './order-feature-list-facade.service';
import { getLlecoopOrderSearchFeatureFormConfig } from './order-feature-search-form.config';
import { LlecoopOrderSearchFeatureTableConfig } from './order-feature-table.config';

export const llecoopOrderFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Les meves comandes',
    component: TableWithFilteringComponent,
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: LlecoopOrderUserStore,
      },
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: LlecoopOrderListFacadeService,
      },
      {
        provide: TABLE_TOKEN,
        useExisting: LlecoopOrderSearchFeatureTableConfig,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopOrderSearchFeatureFormConfig(),
      },
    ],
  },
];
