/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable, signal } from '@angular/core';

import { formatCurrency } from '@angular/common';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import {
  DetailItemViewFacade,
  ExtraFormAction,
  ExtraFormTextAction,
} from '@plastik/core/detail-edit-view';
import { LlecoopOrderProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { userOrderFeatureDetailFormConfig } from './user-order-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderDetailFacadeService implements DetailItemViewFacade<LlecoopUserOrder> {
  private readonly userOrderStore = inject(LlecoopUserOrderStore);
  private readonly orderListStore = inject(LLecoopOrderListStore);

  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'order')[0];

  model = this.userOrderStore.selectedItem;

  viewExtraActions = signal<ExtraFormAction<LlecoopUserOrder>[]>([
    {
      text: formatCurrency(0, 'ca-ES', '€'),
      icon: 'shopping_basket',
      type: 'text',
      id: 'total',
      styles: 'text-md text-primary-dark py-tiny px-sub',
    },
  ]);

  viewConfig = computed(() => {
    return {
      ...this.view,
      title: `Comanda #${this.orderListStore.currentOrder()?.name}` || 'Nova comanda',
    };
  });

  formConfig = userOrderFeatureDetailFormConfig();

  onChange({ totalPrice }: Partial<LlecoopUserOrder>): void {
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
