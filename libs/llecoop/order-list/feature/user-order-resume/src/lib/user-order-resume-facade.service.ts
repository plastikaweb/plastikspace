import { computed, inject, Injectable } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { LlecoopUserOrder, llecoopUserOrderStatus } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';

import { LlecoopUserOrderResumeTableConfig } from './llecoop-user-order-feature-resume/user-order-feature-resume-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderResumeFacadeService {
  readonly #userOrderStore = inject(llecoopUserOrderStore);
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
    const status = this.userOrder()?.status as LlecoopUserOrder['status'];
    return llecoopUserOrderStatus[status] ?? null;
  });
}
