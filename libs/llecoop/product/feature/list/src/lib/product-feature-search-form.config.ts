/* eslint-disable jsdoc/require-jsdoc */
import { computed, inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormSelectOption } from '@plastik/core/entities';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { addSearchInput } from '@plastik/shared/form/search';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductSearchFeatureFormConfig {
  readonly #productStore = inject(llecoopProductStore);
  readonly #categories = computed(() => [
    { label: 'Totes', value: 'all' },
    ...this.#productStore.categories(),
  ]);

  getConfig(): FormlyFieldConfig[] {
    return [
      {
        fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sm',
        fieldGroup: [
          addSearchInput({
            label: 'Filtrar per nom',
            placeholder: 'Filtrar per nom',
          }),
          {
            key: 'category',
            type: 'select',
            defaultValue: this.#productStore.filter()['category'],
            className: 'w-full md:w-1/2',
            props: {
              label: 'Categoría',
              placeholder: 'Categoría',
              required: false,
              options: toObservable(this.#categories),
              compareWith: (o1: FormSelectOption, o2: FormSelectOption) => o1?.value === o2?.value,
            },
          },
          {
            key: 'inStock',
            type: 'select',
            defaultValue: this.#productStore.filter()['inStock'],
            className: 'w-full md:w-1/2',
            props: {
              label: 'Disponibilitat',
              placeholder: 'Disponibilitat',
              required: false,
              options: [
                { label: 'Tots', value: 'all' },
                { label: 'Disponible', value: true },
                { label: 'No disponible', value: false },
              ],
            },
          },
        ],
      },
    ];
  }
}
