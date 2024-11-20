/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade, ExtraFormAction } from '@plastik/core/detail-edit-view';
import { LlecoopOrderProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { getLlecoopUserOrderDetailFormConfig } from './user-order-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderDetailFacadeService implements DetailItemViewFacade<LlecoopUserOrder> {
  private readonly userOrderStore = inject(LlecoopUserOrderStore);
  private readonly orderListStore = inject(LLecoopOrderListStore);

  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'order')[0];

  model = this.userOrderStore.selectedItem;
  formFullWidth = signal(true);
  formSubmitConfig = signal({
    label: 'Desar comanda',
    emitOnChange: true,
    resetOnSubmit: true,
  });
  viewExtraActions = signal<ExtraFormAction<LlecoopUserOrder>[]>([
    {
      text: 'Preu total: 0,00 €',
      icon: 'shopping-cart',
      type: 'text',
      styles: 'font-bold bg-primary-dark text-gray-5 p-sub rounded-lg',
    },
  ]);

  viewConfig = computed(() => {
    return {
      ...this.view,
      title: `Comanda #${this.orderListStore.currentOrder()?.name}` || 'Nova comanda',
    };
  });

  formStructure = getLlecoopUserOrderDetailFormConfig();

  onChange(data: Partial<LlecoopUserOrder>): void {
    const price = this.calculateTotalPrice(data.cart || []);
    this.viewExtraActions.update(actions => {
      const total = actions.find(action => action.type === 'text');
      if (total) {
        total.text = `Preu total: ${price.toFixed(2)} €`;
      }
      return actions;
    });
  }

  onSubmit(data: Partial<LlecoopUserOrder>): void {
    if (this.model()?.id) {
      this.userOrderStore.update(data);
      return;
    }

    this.userOrderStore.create({
      ...data,
      name: this.orderListStore.currentOrder()?.name || '',
    });
  }

  private calculateTotalPrice(cart: LlecoopOrderProduct[]): number {
    return cart.reduce((acc, product) => acc + product.initPrice, 0);
  }
}
