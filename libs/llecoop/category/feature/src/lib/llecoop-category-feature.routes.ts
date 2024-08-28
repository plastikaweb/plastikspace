import { Route } from '@angular/router';
import { FILTER_FORM_TOKEN, STORE_TOKEN } from '@plastik/core/entities';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { TABLE_WITH_FILTERING_TOKEN, TableWithFilteringComponent } from '@plastik/shared/list-view';
import { LlecoopCategorySearchFeatureTableConfig } from './llecoop-category-feature-table.config';
import { LlecoopCategoryListFacadeService } from './llecoop-category-list-facade.service';

export const llecoopCategoryFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'Categories de productes',
    component: TableWithFilteringComponent,
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
  },
];
