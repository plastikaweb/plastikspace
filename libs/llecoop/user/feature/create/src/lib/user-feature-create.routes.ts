import { Route } from '@angular/router';
import { canDeactivateGuard } from '@plastik/core/can-deactivate';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { LlecoopUserCreateFacadeService } from './user-create-facade.service';
import { userFeatureCreateFormConfig } from './user-feature-create-form.config';

export const llecoopUserFeatureCreateRoutes: Route[] = [
  {
    path: '',
    title: 'Crear usuari',
    component: DetailItemFormComponent,
    canDeactivate: [canDeactivateGuard],
    providers: [
      {
        provide: DETAIL_ITEM_VIEW_FACADE,
        useExisting: LlecoopUserCreateFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: userFeatureCreateFormConfig,
      },
    ],
  },
];
