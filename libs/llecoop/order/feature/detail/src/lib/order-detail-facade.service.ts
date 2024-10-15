/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade, ExtraFormAction } from '@plastik/core/detail-edit-view';
import { LlecoopOrderProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopOrderStore } from '@plastik/llecoop/order/data-access';
import { getLlecoopOrderDetailFormConfig } from './order-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderDetailFacadeService implements DetailItemViewFacade<LlecoopUserOrder> {
  private readonly store = inject(LlecoopOrderStore);
  private readonly orderListStore = inject(LLecoopOrderListStore);

  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'order')[0];
  model = this.store.selectedItem;
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
      title: this.orderListStore.currentOrder()?.name || 'Nova comanda',
    };
  });

  formStructure = signal(getLlecoopOrderDetailFormConfig());

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
    // this.model()?.id ? this.store.update(data) : this.store.create(data);
    this.store.create(data);
  }

  private calculateTotalPrice(cart: LlecoopOrderProduct[]): number {
    return cart.reduce((acc, product) => acc + product.initPrice, 0);
  }
}
