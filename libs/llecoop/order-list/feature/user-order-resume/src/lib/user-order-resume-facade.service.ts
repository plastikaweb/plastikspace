import { computed, inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { LlecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { formatUserOrderStatus } from '@plastik/llecoop/order-list/util';

import { LlecoopUserOrderResumeTableConfig } from './llecoop-user-order-feature-resume/user-order-feature-resume-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderResumeFacadeService {
  readonly #userOrderStore = inject(LlecoopUserOrderStore);
  readonly #table = inject(LlecoopUserOrderResumeTableConfig);
  readonly #sanitizer = inject(DomSanitizer);

  readonly #view = inject(VIEW_CONFIG)().filter(item => item.name === 'order')[0];

  tableDefinition = this.#table.getTableDefinition();
  userOrder = this.#userOrderStore.selectedItem;

  viewConfig = computed(() => {
    return {
      ...this.#view,
      title: `Comanda #${this.#userOrderStore.selectedItem()?.name || ''}`,
    };
  });

  formattedUserOrderStatus = computed(() => {
    return (
      this.userOrder && formatUserOrderStatus(this.#sanitizer, this.userOrder()?.status, false)
    );
  });
}
