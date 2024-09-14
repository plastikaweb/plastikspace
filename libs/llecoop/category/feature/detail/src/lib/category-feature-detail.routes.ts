import { Route } from '@angular/router';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LlecoopCategoryDetailFacadeService } from './category-detail-facade.service';
import { getLlecoopDetailFormConfig } from './category-feature-detail-form.config';

export const categoryFeatureDetailRoutes: Route[] = [
  {
    path: '',
    title: 'Nova categoria',
    component: DetailItemFormComponent,
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: LlecoopCategoryStore,
      },
      {
        provide: DETAIL_ITEM_VIEW_FACADE,
        useExisting: LlecoopCategoryDetailFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useValue: getLlecoopDetailFormConfig(),
      },
    ],
  },
];
