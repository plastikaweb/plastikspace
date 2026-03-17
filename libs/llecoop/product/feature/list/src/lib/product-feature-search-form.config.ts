import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { LlecoopSharedCategoryFireService } from '@plastik/llecoop/shared/data-access';
import { addSearchInput } from '@plastik/shared/form/search';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductSearchFeatureFormConfig {
  readonly #productStore = inject(llecoopProductStore);
  readonly #categoryService = inject(LlecoopSharedCategoryFireService);
  readonly #categories$ = this.#categoryService.getCategoriesSelectData();

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
              options: this.#categories$,
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
