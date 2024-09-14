import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { getLlecoopSearchFeatureFormConfig } from './category-feature-search-form.config';
import { LlecoopCategorySearchFeatureTableConfig } from './category-feature-table.config';
import { LlecoopCategoryListFacadeService } from './category-list-facade.service';

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
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: LlecoopCategoryListFacadeService,
      },
      {
        provide: TABLE_TOKEN,
        useExisting: LlecoopCategorySearchFeatureTableConfig,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopSearchFeatureFormConfig(),
      },
    ],
  },
];
