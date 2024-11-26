/* eslint-disable jsdoc/require-jsdoc */
import { inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfig, FormSelectOption } from '@plastik/core/entities';
import {
  LlecoopOrderProduct,
  LlecoopUserOrder,
  llecoopUserOrderDateOptions,
  llecoopUserOrderTimeOptions,
} from '@plastik/llecoop/entities';
import { filter, tap } from 'rxjs';
import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

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

export function userOrderFeatureDetailFormConfig(): FormConfig<LlecoopUserOrder> {
  const tableColumnProperties = inject(LlecoopUserOrderDetailFormTableConfig);

  const formConfig: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-row flex-wrap gap-sm',
      fieldGroup: [
        {
          key: 'userName',
          type: 'input',
          className: 'w-full',
          props: {
            label: 'Sòcia/unitat familiar',
            placeholder: 'Sòcia/unitat familiar',
            required: true,
          },
        },
        {
          key: 'deliveryType',
          type: 'radio',
          className: 'w-full',
          props: {
            label: 'Recollida o lliurament de la comanda',
            required: true,
            options: [
              {
                value: 'pickup',
                label: 'recollida a El Llevat',
              },
              {
                value: 'delivery',
                label: 'lliurament a domicili (cost entre 1 i 3€)',
              },
            ],
          },
        },
        {
          fieldGroupClassName:
            'flex flex-col md:flex-row gap-0 md:gap-sub bg-gray-10 p-sub rounded-md',
          fieldGroup: [
            {
              key: 'address',
              type: 'input',
              className: 'w-full',
              props: {
                label: 'Adreça de lliurament',
                placeholder: 'Adreça de lliurament',
                required: true,
              },
              expressions: {
                hide: 'model.deliveryType === "pickup"',
              },
            },
            {
              key: 'deliveryDate',
              type: 'select',
              className: 'w-full',
              props: {
                label: 'Dia',
                placeholder: 'Dia',
                options: [
                  { value: 'wednesday', label: 'dimecres' },
                  { value: 'tuesday', label: 'dijous' },
                ],
                required: true,
                disabled: true,
                compareWith: (o1: FormSelectOption['value'], o2: FormSelectOption['value']) =>
                  o1 === o2,
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
                compareWith: (o1: FormSelectOption['value'], o2: FormSelectOption['value']) =>
                  o1 === o2,
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
            tableDefinition: tableColumnProperties.getTableDefinition(),
            tableRowValueConditionFn: (element: LlecoopOrderProduct) => element?.initQuantity > 0,
          },
        },
        {
          fieldGroupClassName:
            'flex flex-col md:flex-row gap-0 md:gap-sub bg-gray-10 p-sub rounded-md',
          fieldGroup: [
            {
              key: 'price',
              type: 'input',
              className: 'w-full input-with-enabled-appearance',
              defaultValue: 0,
              props: {
                type: 'number',
                label: 'Preu',
                placeholder: 'Preu',
                disabled: true,
                step: 0.01,
                addonRight: {
                  text: '€',
                },
              },
              hooks: {
                onInit: (formly: FormlyFieldConfig) => {
                  return formly.options?.fieldChanges?.pipe(
                    filter(e => e.type === 'valueChanges' && e.field['key'] === 'cart'),
                    tap(({ value }) => {
                      const total = value.reduce((acc: number, item: LlecoopOrderProduct) => {
                        return acc + item.initPrice;
                      }, 0);
                      formly.formControl?.setValue(Number(total.toFixed(2)));
                    })
                  );
                },
              },
            },
            {
              key: 'deliveryPrice',
              type: 'input',
              className: 'w-full input-with-enabled-appearance',
              defaultValue: 0,
              props: {
                type: 'number',
                label: 'Preu de lliurament',
                placeholder: 'Preu de lliurament',
                disabled: true,
                step: 0.01,
                addonRight: {
                  text: '€',
                },
              },
              hooks: {
                onInit: (formly: FormlyFieldConfig) => {
                  return formly.options?.fieldChanges?.pipe(
                    filter(
                      e =>
                        e.type === 'valueChanges' &&
                        (e.field['key'] === 'price' || e.field['key'] === 'deliveryType')
                    ),
                    tap(({ value }) => {
                      const deliveryType = formly.model?.deliveryType;
                      const deliveryPrice =
                        value === 0 || deliveryType !== 'delivery'
                          ? 0.0
                          : value <= 60
                            ? 3.0
                            : value > 100.01
                              ? 1.0
                              : 2.0;

                      formly.formControl?.setValue(Number(deliveryPrice.toFixed(2)));
                    })
                  );
                },
              },
            },
            {
              key: 'totalPrice',
              type: 'input',
              className: 'w-full input-with-enabled-appearance',
              defaultValue: 0,
              props: {
                type: 'number',
                label: 'Preu final',
                placeholder: 'Preu final',
                disabled: true,
                step: 0.01,
                addonRight: {
                  text: '€',
                },
              },
              hooks: {
                onInit: (formly: FormlyFieldConfig) => {
                  return formly.options?.fieldChanges?.pipe(
                    filter(
                      e =>
                        e.type === 'valueChanges' &&
                        (e.field['key'] === 'price' || e.field['key'] === 'deliveryType')
                    ),
                    tap(() => {
                      const deliveryPrice = formly.model?.deliveryPrice || 0;
                      const price = formly.model?.price || 0;
                      formly.formControl?.setValue(Number(price + deliveryPrice).toFixed(2));
                    })
                  );
                },
              },
            },
          ],
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'Desar comanda',
      emitOnChange: true,
      resetOnSubmit: true,
    }),
    getFormFullWidth: true,
  };
}
