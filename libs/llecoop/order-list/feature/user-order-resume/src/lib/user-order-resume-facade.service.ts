import { computed, inject, Injectable } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { llecoopUserOrderStatus } from '@plastik/llecoop/entities';
import { LlecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';

import { LlecoopUserOrderResumeTableConfig } from './llecoop-user-order-feature-resume/user-order-feature-resume-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderResumeFacadeService {
  readonly #userOrderStore = inject(LlecoopUserOrderStore);
  readonly #table = inject(LlecoopUserOrderResumeTableConfig);

  readonly #view = inject(VIEW_CONFIG)().filter(item => item.name === 'order')[0];

  tableDefinition = this.#table.getTableDefinition();
  userOrder = this.#userOrderStore.selectedItem;

  viewConfig = computed(() => {
    return {
      ...this.#view,
      title: `Resum de la comanda`,
    };
  });

  orderStatus = computed(() => {
    const status = this.userOrder()?.status;
    return status ? llecoopUserOrderStatus[status] : null;
  });
}
