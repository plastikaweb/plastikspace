import { Route } from '@angular/router';
import { FILTER_FORM_TOKEN, STORE_TOKEN } from '@plastik/core/entities';
import {
  LlecoopCategorySearchFeatureTableConfig,
  LlecoopCategoryStore,
} from '@plastik/llecoop/category/data-access';
import { TABLE_WITH_FILTERING_TOKEN, TableWithFilteringComponent } from '@plastik/shared/list-view';
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
        provide: TABLE_WITH_FILTERING_TOKEN,
        useExisting: LlecoopCategoryListFacadeService,
      },
      {
        provide: FILTER_FORM_TOKEN,
        useExisting: LlecoopCategorySearchFeatureTableConfig,
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
