import { Provider } from '@angular/core';
import { Route } from '@angular/router';
import { canDeactivateGuard } from '@plastik/core/can-deactivate';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { isAnActiveOrderListGuard } from './isAnActiveOrderList.guard';
import { isAnActiveOrderListAndUserOrderGuard } from './isAnActiveOrderListAndUserOrder.guard';
import { NewUserOrderDetailResolver } from './new-user-order-detail.resolver';
import { LlecoopUserOrderDetailFacadeService } from './user-order-detail-facade.service';
import { UserOrderDetailResolver } from './user-order-detail.resolver';
import { userOrderFeatureDetailFormConfig } from './user-order-feature-detail-form.config';

const providers: Provider[] = [
  {
    provide: DETAIL_ITEM_VIEW_FACADE,
    useExisting: LlecoopUserOrderDetailFacadeService,
  },
  {
    provide: FORM_TOKEN,
    useFactory: userOrderFeatureDetailFormConfig,
  },
];

export const llecoopUserOrderFeatureDetailCreateRoutes: Route[] = [
  {
    path: '',
    title: 'Nova comanda',
    component: DetailItemFormComponent,
    canDeactivate: [canDeactivateGuard],
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
    canDeactivate: [canDeactivateGuard],
    providers,
    canActivate: [isAnActiveOrderListAndUserOrderGuard],
    resolve: {
      item: UserOrderDetailResolver,
    },
  },
];
