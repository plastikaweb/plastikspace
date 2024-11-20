/* eslint-disable jsdoc/require-jsdoc */
import { inject, signal, Signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { LlecoopOrderListUserOrderDetailFormTableConfig } from './order-list-user-order-detail-table-form.config';

export function getLlecoopOrderListUserOrderDetailFormConfig(): Signal<FormlyFieldConfig[]> {
  const tableColumnProperties = inject(LlecoopOrderListUserOrderDetailFormTableConfig);

  return signal<FormlyFieldConfig[]>([
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
        tableDefinition: tableColumnProperties.getTableDefinition(),
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
  ]);
}
