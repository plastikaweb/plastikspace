/* eslint-disable jsdoc/require-jsdoc */
import { FormConfig } from '@plastik/core/entities';
import { EcoStoreOrder, ORDER_STATUS_OPTIONS } from '@plastik/eco-store/entities';

export type EcoStoreOrdersFilterData = Partial<Pick<EcoStoreOrder, 'status' | 'items'>>;

export function ecoStoreOrdersFilterFormConfig(): FormConfig<EcoStoreOrdersFilterData> {
  const formConfig = [
    {
      fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-4 gap-4 items-center w-full',
      fieldGroup: [
        {
          key: 'items',
          type: 'input-search',
          className: 'col-span-1 md:col-span-3',
          props: {
            label: 'orders.filter.productSearch',
            placeholder: 'orders.filter.productSearchPlaceholder',
            translate: true,
            showLabel: true,
            noButton: true,
            resetSearch: true,
            minLength: 2,
            attributes: {
              autocomplete: 'off',
            },
          },
          modelOptions: {
            debounce: {
              default: 500,
            },
          },
        },

        {
          key: 'status',
          type: 'select-with-icons',
          className: 'col-span-1',
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
