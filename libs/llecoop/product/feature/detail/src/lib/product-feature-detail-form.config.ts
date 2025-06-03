/* eslint-disable jsdoc/require-jsdoc */
import { filter, tap } from 'rxjs';

import { inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfig } from '@plastik/core/entities';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import {
  LlecoopProduct,
  LlecoopProductSelectData,
  LlecoopProductUnit,
} from '@plastik/llecoop/entities';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { InputImgLoaderProps } from '@plastik/shared/form/img-loader';
import { FirebaseStorageService } from '@plastik/storage/data-access';

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

    if (formlyProps['addonRight']) {
      formlyProps['addonRight'].text =
        unitValue === 'unitWithFixedWeight' || unitValue === 'unitWithVariableWeight' ? 'kg' : 'l';
    }
  }
}

export function productFeatureDetailFormConfig(): FormConfig<LlecoopProduct> {
  const productStore = inject(llecoopProductStore);
  const categoryStore = inject(llecoopCategoryStore);
  const firebaseStorage = inject(FirebaseStorageService);

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
            options: toObservable(categoryStore.categoriesList),
          },
        },
        {
          key: 'imgUrl',
          type: 'img-loader',
          className:
            'w-full flex justify-center items-center text-center @md:justify-start @md:items-start @md:text-left',
          props: {
            label: 'Imatge del producte',
            placeholder: 'Imatge del producte',
            required: false,
            folder: signal('products'),
            maxSize: signal(2 * 1024 * 1024),
            minHeight: signal(800),
            minWidth: signal(800),
            dimensions: signal({
              width: 250,
              height: 250,
            }),
            lcpImage: signal(true),
            title: productStore.selectedItemName || signal('nou producte'),
            progress: firebaseStorage.progress.bind(firebaseStorage),
            upload: firebaseStorage.upload.bind(firebaseStorage),
            fileUrl: firebaseStorage.fileUrl.bind(firebaseStorage),
            cdnUrl: signal(''),
          } as InputImgLoaderProps,
          hooks: {
            onInit: (formly: FormlyFieldConfig) => {
              getCdnUrl(formly);
              return formly.options?.fieldChanges?.pipe(
                filter(e => e.type === 'valueChanges' && e.field['key'] === 'imgUrl'),
                tap(() => getCdnUrl(formly))
              );
            },
          },
        },
        {
          key: 'unit',
          fieldGroupClassName: 'flex flex-col @lg:flex-row gap-0 @lg:gap-sub',

          fieldGroup: [
            {
              key: 'type',
              type: 'select',
              className: 'w-full @lg:w-2/3',
              props: {
                label: "Tipus d'unitat",
                placeholder: "Tipus d'unitat",
                required: true,
                options: LlecoopProductSelectData,
              },
            },
            {
              key: 'base',
              type: 'input',
              className: 'w-full @lg:w-1/3',
              props: {
                type: 'number',
                label: 'Pes aproximat per unitat',
                placeholder: 'Pes aproximat per unitat',
                required: true,
                min: 0,
                step: 0.1,
                addonRight: {
                  type: 'text',
                },
                attributes: {
                  autocomplete: 'off',
                },
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
          fieldGroupClassName: 'flex flex-col @lg:flex-row gap-0 @lg:gap-sub max-w-full',
          fieldGroup: [
            {
              key: 'price',
              type: 'input',
              className: 'flex-1 min-w-0 @lg:basis-1/3',
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
                  type: 'text',
                },
                attributes: {
                  autocomplete: 'off',
                },
              },
            },
            {
              key: 'iva',
              type: 'input',
              className: 'flex-1 min-w-0 @lg:basis-1/3',
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
                  type: 'text',
                },
                attributes: {
                  autocomplete: 'off',
                },
              },
            },
            {
              key: 'priceWithIva',
              type: 'input',
              className: 'flex-1 min-w-0 @lg:basis-1/3',
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
                  type: 'text',
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
          fieldGroupClassName: 'flex flex-col @lg:flex-row gap-0 @lg:gap-sub',
          fieldGroup: [
            {
              key: 'isAvailable',
              type: 'checkbox',
              className: 'w-full @lg:w-1/2',
              defaultValue: false,
              props: {
                label: 'Disponible',
              },
            },
            {
              key: 'stock',
              type: 'input',
              className: 'w-full @lg:w-1/2',
              defaultValue: 0,
              props: {
                type: 'number',
                label: 'Quantitat en stock',
                placeholder: 'Quantitat en stock',
                min: 0,
                step: 0.1,
                addonRight: {
                  icon: '',
                  aria: '',
                  type: 'text',
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
          type: 'textarea-with-counter',
          className: 'w-full',
          props: {
            label: 'Més informació',
            placeholder: 'Més informació',
            minLength: 5,
            maxLength: 200,
            maxRows: 2,
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
      disableOnSubmit: true,
    }),
  };

  function getCdnUrl({ model, props }: FormlyFieldConfig): void {
    if (model?.imgUrl) {
      props?.['cdnUrl'].set(model.imgUrl);
    }
  }
}
