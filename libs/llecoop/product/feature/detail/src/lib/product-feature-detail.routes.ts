import { Provider } from '@angular/core';
import { Route } from '@angular/router';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { LlecoopProductDetailFacadeService } from './product-detail-facade.service';
import { getLlecoopProductDetailFormConfig } from './product-feature-detail-form.config';

const providers: Provider[] = [
  {
    provide: STORE_TOKEN,
    useExisting: LlecoopProductStore,
  },
  {
    provide: DETAIL_ITEM_VIEW_FACADE,
    useExisting: LlecoopProductDetailFacadeService,
  },
  {
    provide: FORM_TOKEN,
    useFactory: getLlecoopProductDetailFormConfig,
  },
];

export const productFeatureDetailCreateRoutes: Route[] = [
  {
    path: '',
    title: 'Nou producte',
    component: DetailItemFormComponent,
    providers,
  },
];

export const productFeatureDetailUpdateRoutes: Route[] = [
  {
    path: '',
    title: 'Editar producte',
    component: DetailItemFormComponent,
    providers,
    runGuardsAndResolvers: 'always',
  },
];
