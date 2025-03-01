import { Provider } from '@angular/core';
import { Route } from '@angular/router';
import { canDeactivateGuard } from '@plastik/core/can-deactivate';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';

import { LlecoopCategoryDetailFacadeService } from './category-detail-facade.service';
import { categoryDetailResolver } from './category-detail.resolver';
import { categoryFeatureDetailFormConfig } from './category-feature-detail-form.config';
import { newCategoryDetailResolver } from './new-category-detail.resolver';

const providers: Provider[] = [
  {
    provide: DETAIL_ITEM_VIEW_FACADE,
    useExisting: LlecoopCategoryDetailFacadeService,
  },
  {
    provide: FORM_TOKEN,
    useFactory: categoryFeatureDetailFormConfig,
  },
];

export const categoryFeatureDetailCreateRoutes: Route[] = [
  {
    path: '',
    title: 'Nova categoria',
    component: DetailItemFormComponent,
    canDeactivate: [canDeactivateGuard],
    providers,
    resolve: {
      newCategoryDetail: newCategoryDetailResolver,
    },
  },
];

export const categoryFeatureDetailUpdateRoutes: Route[] = [
  {
    path: '',
    title: 'Editar categoria',
    component: DetailItemFormComponent,
    canDeactivate: [canDeactivateGuard],
    providers,
    resolve: {
      categoryDetail: categoryDetailResolver,
    },
  },
];
