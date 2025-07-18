import { formatCurrency } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import {
  DetailItemViewFacade,
  ExtraFormAction,
  ExtraFormTextAction,
} from '@plastik/core/detail-edit-view';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

import { userOrderFeatureDetailFormConfig } from './user-order-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderDetailFacadeService implements DetailItemViewFacade<LlecoopUserOrder> {
  readonly #userOrderStore = inject(llecoopUserOrderStore);
  readonly #orderListStore = inject(llecoopOrderListStore);

  readonly #view = inject(VIEW_CONFIG)().filter(item => item.name === 'order')[0];

  model = this.#userOrderStore.selectedItem;

  viewExtraActions = signal<ExtraFormAction<LlecoopUserOrder>[]>([
    {
      text: formatCurrency(0, 'ca-ES', '€'),
      icon: 'shopping_basket',
      type: 'text',
      id: 'total',
      styles: 'text-md py-tiny px-sub',
    },
  ]);

  viewConfig = computed(() => ({
    ...this.#view,
    title: this.model() ? `Comanda #${this.model()?.name}` : 'Nova comanda',
  }));

  formConfig = userOrderFeatureDetailFormConfig();

  onFormTemporaryChange({ totalPrice }: Partial<LlecoopUserOrder>): void {
    this.viewExtraActions.update(actions => {
      let total = actions.filter(action => action.id === 'total')[0] as ExtraFormTextAction;
      if (total) {
        total = {
          ...total,
          text: formatCurrency(totalPrice ?? 0, 'ca-ES', '€'),
        };
      }

      return [...actions.filter(action => action.id !== 'total'), total];
    });
  }

  onSubmit(item: Partial<LlecoopUserOrder>): void {
    if (this.model()?.id) {
      this.#userOrderStore.update({ item });
      return;
    }

    this.#userOrderStore.create({
      item: {
        ...item,
        orderListId: this.#orderListStore.currentOrderList()?.id || '',
        name: this.#orderListStore.currentOrderList()?.name || '',
      },
    });
  }
}
