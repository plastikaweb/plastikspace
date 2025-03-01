import { map } from 'rxjs';

/* eslint-disable jsdoc/require-jsdoc */
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { addSearchInput } from '@plastik/shared/form/search';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductSearchFeatureFormConfig {
  readonly #categoryStore = inject(llecoopCategoryStore);
  readonly #productStore = inject(llecoopProductStore);

  getConfig(): FormlyFieldConfig[] {
    this.#categoryStore.getAll();
    return [
      {
        fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sm',
        fieldGroup: [
          addSearchInput({
            label: 'Filtrar per nom',
            placeholder: 'Buidar valor',
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
              options: toObservable(this.#categoryStore.selectByNameOptions).pipe(
                map(options => [{ label: 'Totes', value: 'all' }, ...options])
              ),
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
