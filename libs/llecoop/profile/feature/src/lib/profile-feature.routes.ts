import { Route } from '@angular/router';
import { canDeactivateGuard } from '@plastik/core/can-deactivate';
import { DETAIL_ITEM_VIEW_FACADE } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';

import { LlecoopProfileFeatureFacadeService } from './profile-feature-facade.service';
import { profileFeatureFormConfig } from './profile-feature-form.config';
import { ProfileFeatureComponent } from './profile-feature.component';
import { profileFeatureResolver } from './profile-feature.resolver';

export const profileFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'Perfil',
    component: ProfileFeatureComponent,
    canDeactivate: [canDeactivateGuard],
    providers: [
      {
        provide: DETAIL_ITEM_VIEW_FACADE,
        useExisting: LlecoopProfileFeatureFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: profileFeatureFormConfig,
      },
    ],
    resolve: {
      resolveProfile: profileFeatureResolver,
    },
  },
];
