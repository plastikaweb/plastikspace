/* eslint-disable jsdoc/require-jsdoc */
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import {
  LlecoopProductCategory,
  LlecoopProductSelectData,
  LlecoopProductUnit,
} from '@plastik/llecoop/entities';
import { filter, tap } from 'rxjs';

export function getLlecoopProductDetailFormConfig(): FormlyFieldConfig[] {
  const categoryStore = inject(LlecoopCategoryStore);

  return [
    {
      fieldGroupClassName: 'flex flex-row flex-wrap gap-sm',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          className: 'w-full',
          props: {
            type: 'text',
            label: 'Nom',
            placeholder: 'Nom',
            required: true,
            maxLength: 256,
            minLength: 2,
          },
        },
        {
          key: 'category',
          type: 'select',
          className: 'w-full',
          props: {
            label: 'Categoria',
            placeholder: 'Categoria',
            required: true,
            options: toObservable(categoryStore.selectOptions),
            compareWith: (o1: LlecoopProductCategory, o2: LlecoopProductCategory) =>
              o1?.id === o2?.id,
          },
        },
        {
          key: 'description',
          type: 'textarea',
          className: 'w-full',
          props: {
            label: 'Descripció',
            placeholder: 'Descripció',
            rows: 5,
            required: true,
          },
        },
        {
          fieldGroupClassName:
            'flex flex-col md:flex-row gap-0 md:gap-sm bg-gray-10 p-sm rounded-md',
          fieldGroup: [
            {
              key: 'price',
              type: 'input',
              defaultValue: 0,
              className: 'w-full md:w-1/3',
              props: {
                type: 'number',
                label: 'Preu',
                placeholder: 'Preu',
                required: true,
                min: 0,
                step: 0.01,
                addonRight: {
                  text: '€',
                },
              },
            },
            {
              key: 'iva',
              type: 'input',
              defaultValue: 0,
              className: 'w-full md:w-1/3',
              props: {
                type: 'number',
                label: 'IVA',
                placeholder: 'IVA',
                required: true,
                min: 0,
                max: 100,
                step: 0.1,
                addonRight: {
                  text: '%',
                },
              },
            },
            {
              key: 'priceWithIva',
              type: 'input',
              className: 'w-full md:w-1/3',
              defaultValue: 0,
              props: {
                type: 'text',
                label: 'Preu amb IVA',
                placeholder: 'Preu amb IVA',
                required: true,
                disabled: true,
                min: 0,
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
                        (e.field['key'] === 'price' || e.field['key'] === 'iva')
                    ),
                    tap(({ field }) => {
                      let { price, iva } = field.model;
                      price = Number(price);
                      iva = Number(iva);
                      if (!isNaN(price) && !isNaN(iva)) {
                        const priceWithIva = parseFloat((price + price * (iva / 100)).toFixed(2));
                        formly.formControl?.setValue(priceWithIva);
                      }
                    })
                  );
                },
              },
            },
          ],
        },
        {
          key: 'unit',
          fieldGroupClassName:
            'flex flex-col md:flex-row gap-0 md:gap-sm bg-gray-10 p-sm rounded-md',
          fieldGroup: [
            {
              key: 'type',
              type: 'select',
              props: {
                label: "Tipus d'unitat",
                placeholder: "Tipus d'unitat",
                required: true,
                options: LlecoopProductSelectData,
              },
            },
            {
              key: 'baseWeight',
              type: 'number',
              props: {
                label: 'Pes aproximat per unitat',
                placeholder: 'Pes aproximat per unitat',
                required: true,
                min: 0,
                step: 0.01,
                addonRight: {
                  text: 'g',
                },
              },
              expressions: {
                hide: ({ model }) => model?.type !== 'unitWithVariableWeight',
              },
            },
          ],
        },
        {
          key: 'origin',
          type: 'input',
          className: 'w-full',
          props: {
            type: 'text',
            label: 'Origen',
            placeholder: 'Origen',
            required: false,
          },
        },
        {
          key: 'provider',
          type: 'input',
          className: 'w-full',
          props: {
            type: 'text',
            label: 'Proveïdor',
            placeholder: 'Proveïdor',
            required: false,
          },
        },
        {
          fieldGroupClassName:
            'flex flex-col md:flex-row gap-0 md:gap-sm bg-gray-10 p-sm rounded-md',
          fieldGroup: [
            {
              key: 'isAvailable',
              type: 'checkbox',
              defaultValue: false,
              props: {
                label: 'Disponible',
              },
            },
            {
              key: 'stock',
              type: 'input',
              props: {
                type: 'number',
                label: 'Quantitat en stock',
                placeholder: 'Quantitat en stock',
                min: 0,
                step: 0.1,
                addonRight: {
                  text: '',
                },
              },
              hooks: {
                onInit: (formly: FormlyFieldConfig) => {
                  setStockUnitAddonRight(formly.props, formly.model?.unit);

                  return formly.options?.fieldChanges?.pipe(
                    filter(e => e.type === 'valueChanges' && e.field['key'] === 'type'),
                    tap(({ value }) => setStockUnitAddonRight(formly.props, value))
                  );
                },
              },
            },
          ],
        },
      ],
    },
  ];
}

function setStockUnitAddonRight(
  formlyProps: FormlyFieldConfig['props'],
  unitValue: LlecoopProductUnit
): void {
  if (formlyProps?.['addonRight']) {
    formlyProps['addonRight'].text = unitValue?.type === 'weight' ? 'kg' : 'u.';
  }
}
