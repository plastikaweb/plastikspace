/* eslint-disable jsdoc/require-jsdoc */
import { computed, inject, Injectable, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfig } from '@plastik/core/entities';
import { LlecoopOrderProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';

import { OrderListUserOrderResumeTableConfig } from './order-list-user-order-resume-table.config';

@Injectable({
  providedIn: 'root',
})
export class OrderListUserOrderResumeFormConfig {
  readonly #store = inject(llecoopOrderListStore);
  readonly #tableColumnProperties = inject(OrderListUserOrderResumeTableConfig);

  userOrderData = signal<LlecoopUserOrder | null>(null);

  readonly #userOrderCartEditable = computed(() => {
    const orderListId = this.userOrderData()?.orderListId;
    if (!orderListId) {
      return false;
    }
    const orderList = this.#store.getItemById(orderListId);
    if (!orderList) {
      return false;
    }

    return (
      orderList.status === 'done' &&
      this.userOrderData()?.status !== 'cancelled' &&
      this.userOrderData()?.status !== 'delivered' &&
      this.userOrderData()?.status !== 'blocked'
    );
  });

  readonly #config = [
    {
      key: 'id',
    },
    {
      key: 'orderListId',
    },
    {
      key: 'cart',
      type: 'table',
      props: {
        required: true,
        tableRowValueConditionFn: (element: LlecoopOrderProduct) => element,
      },
      validators: {
        allReviewed: {
          expression: (control: AbstractControl) =>
            control.value?.every((element: LlecoopOrderProduct) => element.reviewed),
          message: 'Tots els productes han de ser revisats',
        },
      },
      hooks: {
        onInit: (formly: FormlyFieldConfig) => {
          if (formly.props) {
            this.userOrderData.set(formly.model);
            this.#tableColumnProperties.cartIsEditable.set(this.#userOrderCartEditable());
            formly.props['tableDefinition'] = this.#tableColumnProperties.getTableDefinition();
          }
        },
      },
    },
  ];

  get(): FormConfig<LlecoopOrderProduct> {
    return {
      getConfig: () => this.#config,
      getSubmitFormConfig: () => ({
        label: 'Actualizar comanda',
        emitOnChange: false,
        submitAvailable: this.#userOrderCartEditable(),
      }),
    };
  }
}
