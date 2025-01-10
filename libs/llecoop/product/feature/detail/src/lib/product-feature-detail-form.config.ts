/* eslint-disable jsdoc/require-jsdoc */
import { filter, tap } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DocumentReference } from '@angular/fire/firestore';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfig } from '@plastik/core/entities';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import {
    LlecoopProduct, LlecoopProductCategory, LlecoopProductSelectData, LlecoopProductUnit
} from '@plastik/llecoop/entities';

function setStockUnitAddonRight(
  formlyProps: FormlyFieldConfig['props'],
  unitValue: LlecoopProductUnit['type']
): void {
  if (formlyProps?.['addonRight']) {
    formlyProps['addonRight'].text = unitValue === 'weight' ? 'kg' : 'u.';
    formlyProps['addonRight'].aria = unitValue === 'weight' ? 'pes en kgs' : 'unitats';
  }
}

function setUnitBaseInfo(
  formlyProps: FormlyFieldConfig['props'],
  unitValue: LlecoopProductUnit['type']
): void {
  if (formlyProps) {
    const label =
      unitValue === 'unitWithFixedVolume'
        ? 'Volum per unitat'
        : unitValue === 'unitWithFixedWeight'
          ? 'Pes per unitat'
          : unitValue === 'unitWithVariableWeight'
            ? 'Pes aproximat per unitat'
            : '';
    formlyProps.label = label;
    formlyProps.placeholder = label;

    if (formlyProps) {
      formlyProps['addonRight'].text =
        unitValue === 'unitWithFixedWeight' || unitValue === 'unitWithVariableWeight' ? 'kg' : 'l';
    }
  }
}

export function productFeatureDetailFormConfig(): FormConfig<LlecoopProduct> {
  const store = inject(LlecoopCategoryStore);

  const formConfig = [
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
            placeholder: 'Nom del producte',
            required: true,
            maxLength: 256,
            minLength: 2,
            attributes: {
              autocomplete: 'off',
            },
          },
        },
        {
          key: 'categoryRef',
          type: 'select',
          className: 'w-full',
          props: {
            label: 'Categoria',
            placeholder: 'Categoria',
            required: true,
            options: toObservable(store.selectOptions),
            compareWith: (
              o1: DocumentReference<LlecoopProductCategory>,
              o2: DocumentReference<LlecoopProductCategory>
            ) => o1 === o2,
          },
        },
        {
          key: 'unit',
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
              key: 'base',
              type: 'number',
              props: {
                label: 'Pes aproximat per unitat',
                placeholder: 'Pes aproximat per unitat',
                required: true,
                min: 0,
                step: 0.1,
                addonRight: {},
              },
              expressions: {
                hide: ({ model }: FormlyFieldConfig) =>
                  model?.type === 'unit' || model?.type === 'weight',
              },
              hooks: {
                onInit: (formly: FormlyFieldConfig) => {
                  setUnitBaseInfo(formly.props, formly.model?.type);

                  return formly.options?.fieldChanges?.pipe(
                    filter(e => e.type === 'valueChanges' && e.field['key'] === 'type'),
                    tap(({ value }) => setUnitBaseInfo(formly.props, value))
                  );
                },
              },
            },
          ],
        },
        {
          fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sub p-sub rounded-md',
          fieldGroup: [
            {
              key: 'price',
              type: 'input',
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
                  aria: 'preu en euros',
                },
                attributes: {
                  autocomplete: 'off',
                },
              },
            },
            {
              key: 'iva',
              type: 'input',
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
                  aria: "percentatge d'IVA",
                },
                attributes: {
                  autocomplete: 'off',
                },
              },
            },
            {
              key: 'priceWithIva',
              type: 'input',
              className: 'w-full md:w-1/3',
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
                  aria: 'preu amb IVA en euros',
                },
                attributes: {
                  autocomplete: 'off',
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
          fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sub p-sub',
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
                  aria: '',
                },
                attributes: {
                  autocomplete: 'off',
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
        {
          key: 'info',
          type: 'textarea',
          className: 'w-full',
          props: {
            label: 'Més informació',
            placeholder: 'Més informació',
            rows: 3,
            attributes: {
              autocomplete: 'off',
            },
          },
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
            attributes: {
              autocomplete: 'off',
            },
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
            attributes: {
              autocomplete: 'off',
            },
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: (editMode = false) => ({
      label: editMode ? 'Desar producte' : 'Crear producte',
      emitOnChange: true,
    }),
  };
}
