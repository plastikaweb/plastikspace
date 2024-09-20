import { Provider } from '@angular/core';
import { Route } from '@angular/router';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LlecoopCategoryDetailFacadeService } from './category-detail-facade.service';
import { CategoryDetailResolver } from './category-detail.resolver';
import { getLlecoopCategoryDetailFormConfig } from './category-feature-detail-form.config';

const providers: Provider[] = [
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
    useValue: getLlecoopCategoryDetailFormConfig(),
  },
];

export const categoryFeatureDetailCreateRoutes: Route[] = [
  {
    path: '',
    title: 'Nova categoria',
    component: DetailItemFormComponent,
    providers,
  },
];

export const categoryFeatureDetailUpdateRoutes: Route[] = [
  {
    path: '',
    title: 'Editar categoria',
    component: DetailItemFormComponent,
    providers,
    resolve: {
      item: CategoryDetailResolver,
    },
    runGuardsAndResolvers: 'always',
  },
];
