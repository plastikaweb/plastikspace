import { Route } from '@angular/router';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
import { getLlecoopUserCreateFormConfig } from './user-feature-create-form.config';
import { LlecoopUserCreateFacadeService } from './user-create-facade.service';

export const llecoopUserFeatureCreateRoutes: Route[] = [
  {
    path: '',
    title: 'Crear usuari',
    component: DetailItemFormComponent,
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: LLecoopUserStore,
      },
      {
        provide: DETAIL_ITEM_VIEW_FACADE,
        useExisting: LlecoopUserCreateFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopUserCreateFormConfig(),
      },
    ],
  },
];
