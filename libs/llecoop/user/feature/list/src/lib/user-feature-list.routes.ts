import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';

import { LlecoopUserListFacadeService } from './user-feature-list-facade.service';
import { userFeatureListResolver } from './user-feature-list.resolver';
import { getLlecoopUserSearchFeatureFormConfig } from './user-feature-search-form.config';
import { LlecoopUserSearchFeatureTableConfig } from './user-feature-table.config';

export const llecoopUserFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Usuaris',
    component: TableWithFilteringComponent,
    providers: [
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: LlecoopUserListFacadeService,
      },
      {
        provide: TABLE_TOKEN,
        useExisting: LlecoopUserSearchFeatureTableConfig,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopUserSearchFeatureFormConfig,
      },
    ],
    resolve: {
      listUserStore: userFeatureListResolver,
    },
    runGuardsAndResolvers: 'always',
  },
];
