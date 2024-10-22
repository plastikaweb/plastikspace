import { Route } from '@angular/router';
import { DETAIL_ITEM_VIEW_FACADE, DetailItemFormComponent } from '@plastik/core/detail-edit-view';
import { FORM_TOKEN } from '@plastik/core/entities';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import { LlecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopOrderDetailFacadeService } from './order-detail-facade.service';
import { getLlecoopOrderDetailFormConfig } from './order-feature-detail-form.config';

export const llecoopOrderFeatureDetailRoutes: Route[] = [
  {
    path: '',
    title: 'Les meves comandes',
    component: DetailItemFormComponent,
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: LlecoopUserOrderStore,
      },
      {
        provide: DETAIL_ITEM_VIEW_FACADE,
        useExisting: LlecoopOrderDetailFacadeService,
      },
      {
        provide: FORM_TOKEN,
        useFactory: getLlecoopOrderDetailFormConfig,
      },
    ],
  },
];
