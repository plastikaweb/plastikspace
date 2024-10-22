import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LlecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { LlecoopUserOrderListFacadeService } from './user-order-feature-list-facade.service';
import { getLlecoopUserOrderSearchFeatureFormConfig } from './user-order-feature-search-form.config';
import { LlecoopUserOrderSearchFeatureTableConfig } from './user-order-feature-table.config';

export const llecoopUserOrderFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Les meves comandes',
    component: TableWithFilteringComponent,
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: LlecoopUserOrderStore,
      },
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: LlecoopUserOrderListFacadeService,
      },
      {
        provide: TABLE_TOKEN,
        useExisting: LlecoopUserOrderSearchFeatureTableConfig,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopUserOrderSearchFeatureFormConfig(),
      },
    ],
  },
];
