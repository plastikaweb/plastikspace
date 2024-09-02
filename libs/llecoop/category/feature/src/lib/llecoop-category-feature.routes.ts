import { Route } from '@angular/router';
import { FILTER_FORM_TOKEN, STORE_TOKEN } from '@plastik/core/entities';
import {
  getLlecoopSearchFeatureFormConfig,
  LlecoopCategorySearchFeatureTableConfig,
  LlecoopCategoryStore,
} from '@plastik/llecoop/category/data-access';
import {
  TABLE_WITH_FILTERING_FACADE,
  TableWithFilteringComponent,
} from '@plastik/shared/list-view';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { LlecoopCategoryListResolver } from './llecoop-category-feature-list.resolver';
import { LlecoopCategoryListFacadeService } from './llecoop-category-list-facade.service';

export const llecoopCategoryFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'Categories de productes',
    component: TableWithFilteringComponent,
    resolve: {
      data: LlecoopCategoryListResolver,
    },
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: LlecoopCategoryStore,
      },
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: LlecoopCategoryListFacadeService,
      },
      {
        provide: TABLE_TOKEN,
        useExisting: LlecoopCategorySearchFeatureTableConfig,
      },
      {
        provide: FILTER_FORM_TOKEN,
        useValue: getLlecoopSearchFeatureFormConfig(),
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
