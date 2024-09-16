import { Route } from '@angular/router';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { LlecoopProductListFacadeService } from './product-feature-list-facade.service';
import { LlecoopProductListResolver } from './product-feature-list.resolver';
import { LlecoopProductSearchFeatureTableConfig } from './product-feature-table.config';

export const llecoopProductFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Productes',
    component: TableWithFilteringComponent,
    resolve: {
      data: LlecoopProductListResolver,
    },
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
    ],
    runGuardsAndResolvers: 'always',
  },
];
