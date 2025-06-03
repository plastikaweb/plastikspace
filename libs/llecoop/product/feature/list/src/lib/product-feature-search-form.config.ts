/* eslint-disable jsdoc/require-jsdoc */
import { computed, inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { addSearchInput } from '@plastik/shared/form/search';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductSearchFeatureFormConfig {
  readonly #productStore = inject(llecoopProductStore);
  readonly #categoryStore = inject(llecoopCategoryStore);
  readonly #categories = computed(() => [
    { label: 'Totes', value: '' },
    ...this.#categoryStore.categoriesList(),
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
            },
          },
          {
            key: 'isAvailable',
            type: 'select',
            defaultValue: this.#productStore.filter()['isAvailable'],
            className: 'w-full md:w-1/2',
            props: {
              label: 'Disponibilitat',
              placeholder: 'Disponibilitat',
              required: false,
              options: [
                { label: 'Tots', value: 'all' },
                { label: 'Disponible', value: 'on' },
                { label: 'No disponible', value: 'off' },
              ],
            },
          },
        ],
      },
    ];
  }
}
