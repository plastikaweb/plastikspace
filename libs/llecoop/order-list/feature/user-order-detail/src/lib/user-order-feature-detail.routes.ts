import { Provider } from '@angular/core';
import { Route } from '@angular/router';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { isAnActiveOrderListGuard } from './isAnActiveOrderList.guard';
import { isAnActiveOrderListAndUserOrderGuard } from './isAnActiveOrderListAndUserOrder.guard';
import { LlecoopUserOrderDetailFacadeService } from './user-order-detail-facade.service';
import { UserOrderDetailResolver } from './user-order-detail.resolver';
import { getLlecoopUserOrderDetailFormConfig } from './user-order-feature-detail-form.config';
import { NewUserOrderDetailResolver } from './new-user-order-detail.resolver';

const providers: Provider[] = [
  {
    provide: DETAIL_ITEM_VIEW_FACADE,
    useExisting: LlecoopUserOrderDetailFacadeService,
  },
  {
    provide: FORM_TOKEN,
    useFactory: getLlecoopUserOrderDetailFormConfig,
  },
];

export const llecoopUserOrderFeatureDetailCreateRoutes: Route[] = [
  {
    path: '',
    title: 'Nova comanda',
    component: DetailItemFormComponent,
    providers,
    canActivate: [isAnActiveOrderListGuard],
    resolve: {
      item: NewUserOrderDetailResolver,
    },
  },
];

export const llecoopUserOrderFeatureDetailUpdateRoutes: Route[] = [
  {
    path: '',
    title: 'Editar comanda',
    component: DetailItemFormComponent,
    providers,
    canActivate: [isAnActiveOrderListAndUserOrderGuard],
    resolve: {
      item: UserOrderDetailResolver,
    },
  },
];
