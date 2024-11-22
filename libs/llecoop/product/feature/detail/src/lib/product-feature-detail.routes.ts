import { Provider } from '@angular/core';
import { Route } from '@angular/router';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { NewProductDetailResolver } from './new-product-detail.resolver';
import { LlecoopProductDetailFacadeService } from './product-detail-facade.service';
import { ProductDetailResolver } from './product-detail.resolver';
import { productFeatureDetailFormConfig } from './product-feature-detail-form.config';

const providers: Provider[] = [
  {
    provide: DETAIL_ITEM_VIEW_FACADE,
    useExisting: LlecoopProductDetailFacadeService,
  },
  {
    provide: FORM_TOKEN,
    useFactory: productFeatureDetailFormConfig,
  },
];

export const productFeatureDetailCreateRoutes: Route[] = [
  {
    path: '',
    title: 'Nou producte',
    component: DetailItemFormComponent,
    providers,
    resolve: {
      item: NewProductDetailResolver,
    },
  },
];

export const productFeatureDetailUpdateRoutes: Route[] = [
  {
    path: '',
    title: 'Editar producte',
    component: DetailItemFormComponent,
    providers,
    resolve: {
      item: ProductDetailResolver,
    },
  },
];
