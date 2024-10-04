import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { LlecoopUserListFacadeService } from './user-feature-list-facade.service';
import { getLlecoopUserSearchFeatureFormConfig } from './user-feature-search-form.config';
import { LlecoopUserSearchFeatureTableConfig } from './user-feature-table.config';

export const llecoopUserFeatureListRoutes: Route[] = [
  {
    path: '',
    title: 'Usuaris',
    component: TableWithFilteringComponent,
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: LLecoopUserStore,
      },
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
  },
];
