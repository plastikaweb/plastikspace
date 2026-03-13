/* eslint-disable jsdoc/require-jsdoc */
import { FormConfig } from '@plastik/core/entities';
import { EcoStoreOrder, ORDER_STATUS_OPTIONS } from '@plastik/eco-store/entities';

export type EcoStoreOrdersFilterData = Partial<Pick<EcoStoreOrder, 'status'>>;

export function ecoStoreOrdersFilterFormConfig(): FormConfig<EcoStoreOrdersFilterData> {
  const formConfig = [
    {
      fieldGroupClassName: 'flex flex-row flex-wrap gap-2 ',
      fieldGroup: [
        {
          key: 'status',
          type: 'select-with-icons',
          className: 'w-full!',
          props: {
            label: 'orders.filter.status',
            translate: true,
            required: false,
            options: [
              { value: '', label: 'orders.filter.all', icon: 'list_alt' },
              ...ORDER_STATUS_OPTIONS,
            ],
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      visible: false,
      submitAvailable: false,
      emitOnChange: true,
      buttonStyle: 'hidden!',
    }),
  };
}
