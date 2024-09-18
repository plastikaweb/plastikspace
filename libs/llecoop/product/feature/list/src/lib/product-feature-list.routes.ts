import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { LlecoopProductListFacadeService } from './product-feature-list-facade.service';
import { getLlecoopProductSearchFeatureFormConfig } from './product-feature-search-form.config';
import { LlecoopProductSearchFeatureTableConfig } from './product-feature-table.config';

export const llecoopProductFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Productes',
    component: TableWithFilteringComponent,
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: LlecoopProductStore,
      },
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: LlecoopProductListFacadeService,
      },
      {
        provide: TABLE_TOKEN,
        useExisting: LlecoopProductSearchFeatureTableConfig,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopProductSearchFeatureFormConfig(),
      },
    ],
  },
];
