/* eslint-disable jsdoc/require-jsdoc */
import { inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  LlecoopOrderProduct,
  llecoopUserOrderDateOptions,
  llecoopUserOrderTimeOptions,
} from '@plastik/llecoop/entities';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopOrderStore } from '@plastik/llecoop/order/data-access';
import { filter, tap } from 'rxjs';
import { LlecoopOrderDetailFormTableConfig } from './order-detail-table-form.config';

export function getLlecoopOrderDetailFormConfig(): FormlyFieldConfig[] {
  const orderStore = inject(LlecoopOrderStore);
  const orderListStore = inject(LLecoopOrderListStore);

  const tableColumnProperties = inject(LlecoopOrderDetailFormTableConfig);

  return [
    {
      fieldGroupClassName: 'flex flex-row flex-wrap gap-sm',
      fieldGroup: [
        {
          fieldGroupClassName:
            'flex flex-col md:flex-row gap-0 md:gap-sub bg-gray-10 p-sub rounded-md',
          fieldGroup: [
            {
              key: 'name',
              type: 'input',
              className: 'w-full',
              props: {
                label: 'Sòcia/unitat familiar',
                placeholder: 'Sòcia/unitat familiar',
                required: true,
              },
            },
            {
              key: 'address',
              type: 'input',
              className: 'w-full',
              props: {
                label: 'Adreça de lliurament',
                placeholder: 'Adreça de lliurament',
                required: true,
              },
            },
          ],
        },
        {
          fieldGroupClassName:
            'flex flex-col md:flex-row gap-0 md:gap-sub bg-gray-10 p-sub rounded-md',
          fieldGroup: [
            {
              key: 'deliveryType',
              type: 'radio',
              props: {
                required: true,
                options: [
                  {
                    value: 'pickup',
                    label: 'recollida',
                  },
                  {
                    value: 'delivery',
                    label: 'lliurament',
                  },
                ],
              },
            },
            {
              key: 'deliveryDate',
              type: 'select',
              className: 'w-full',
              props: {
                label: 'Dia',
                placeholder: 'Dia',
                options: [],
                required: true,
                disabled: true,
              },
              hooks: {
                onInit: (formly: FormlyFieldConfig) => {
                  setDayOptionsByDeliveryOption(formly.props, formly.model?.deliveryType);

                  return formly.options?.fieldChanges?.pipe(
                    filter(e => e.type === 'valueChanges' && e.field.key === 'deliveryType'),
                    tap(({ value }) => setDayOptionsByDeliveryOption(formly.props, value))
                  );
                },
              },
            },
            {
              key: 'deliveryTime',
              type: 'select',
              className: 'w-full',
              props: {
                label: 'Hora',
                placeholder: 'Hora',
                options: [],
                required: true,
                disabled: true,
              },
              hooks: {
                onInit: (formly: FormlyFieldConfig) => {
                  setHourOptionsByDeliveryOption(formly.props, formly.model?.deliveryType);

                  return formly.options?.fieldChanges?.pipe(
                    filter(e => e.type === 'valueChanges' && e.field.key === 'deliveryType'),
                    tap(({ value }) => setHourOptionsByDeliveryOption(formly.props, value))
                  );
                },
              },
            },
          ],
        },
        {
          key: 'deliveryInfo',
          type: 'textarea-with-counter',
          className: 'w-full',
          props: {
            placeholder:
              'Qualsevol informació que ens vulguis fer arribar sobre la comanda i el seu lliurament o recollida',
            label: 'Informació addicional',
            minLength: 5,
            maxLength: 100,
            maxRows: 3,
          },
        },
        {
          key: 'cart',
          type: 'table',
          className: 'w-full',
          props: {
            required: true,
            tableData: orderListStore.currentOrderProducts,
            tableStructure: tableColumnProperties.getTableStructure(),
            tableRowValueConditionFn: (element: LlecoopOrderProduct) => {
              return element?.initQuantity > 0;
            },
          },
        },
      ],
    },
  ];
}

function setDayOptionsByDeliveryOption(
  formlyProps: FormlyFieldConfig['props'],
  deliveryType: 'pickup' | 'delivery'
): void {
  if (formlyProps) {
    formlyProps['disabled'] = !deliveryType || false;
    formlyProps['options'] = llecoopUserOrderDateOptions[deliveryType];
  }
}

function setHourOptionsByDeliveryOption(
  formlyProps: FormlyFieldConfig['props'],
  deliveryType: 'pickup' | 'delivery'
): void {
  if (formlyProps) {
    formlyProps['disabled'] = !deliveryType || false;
    formlyProps['options'] = llecoopUserOrderTimeOptions[deliveryType];
  }
}
