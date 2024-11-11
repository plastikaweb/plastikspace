import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { getLlecoopCategorySearchFeatureFormConfig } from './category-feature-search-form.config';
import { LlecoopCategorySearchFeatureTableConfig } from './category-feature-table.config';
import { LlecoopCategoryListFacadeService } from './category-list-facade.service';

export const llecoopCategoryFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'Categories de productes',
    component: TableWithFilteringComponent,
    providers: [
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
        useValue: getLlecoopCategorySearchFeatureFormConfig(),
      },
    ],
  },
];
