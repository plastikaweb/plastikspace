/* eslint-disable jsdoc/require-jsdoc */
import { inject, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormConfig } from '@plastik/core/entities';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { LlecoopOrderListUserOrderDetailFormTableConfig } from './order-list-user-order-detail-table-form.config';

@Injectable({
  providedIn: 'root',
})
export class OrderListUserOrderDetailFormConfig {
  private readonly tableColumnProperties = inject(LlecoopOrderListUserOrderDetailFormTableConfig);
  private readonly config = [
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
        tableDefinition: this.tableColumnProperties.getTableDefinition(),
        tableRowValueConditionFn: (element: LlecoopOrderProduct) => element,
      },
      validators: {
        allReviewed: {
          expression: (control: AbstractControl) =>
            control.value?.every((element: LlecoopOrderProduct) => element.reviewed),
          message: 'Tots els productes han de ser revisats',
        },
      },
    },
  ];

  get(): FormConfig<LlecoopOrderProduct> {
    return {
      getConfig: () => this.config,
      getSubmitFormConfig: () => ({
        label: 'Desar comanda',
        buttonStyle: 'w-[150px]',
        emitOnChange: true,
      }),
    };
  }
}
