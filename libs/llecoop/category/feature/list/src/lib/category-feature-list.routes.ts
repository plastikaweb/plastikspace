import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Route } from '@angular/router';
import { FORM_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import {
  getLlecoopSearchFeatureFormConfig,
  LlecoopCategorySearchFeatureTableConfig,
  LlecoopCategoryStore,
} from '@plastik/llecoop/category/data-access';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { LlecoopCategoryListResolver } from './category-feature-list.resolver';
import { LlecoopCategoryListFacadeService } from './category-list-facade.service';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const llecoopCategoryFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'Categories de productes',
    component: TableWithFilteringComponent,
    resolve: {
      data: LlecoopCategoryListResolver,
    },
    // canActivate: [AuthGuard],
    // data: {
    //   authGuardPipe: redirectUnauthorizedToLogin,
    // },
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
    runGuardsAndResolvers: 'always',
  },
];
