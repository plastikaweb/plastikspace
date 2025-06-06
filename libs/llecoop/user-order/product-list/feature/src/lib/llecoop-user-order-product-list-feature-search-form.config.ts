import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { LlecoopSharedCategoryFireService } from '@plastik/llecoop/shared/data-access';
import { llecoopUserOrderProductStore } from '@plastik/llecoop/user-order-product-list/data-access';
import { addSearchInput } from '@plastik/shared/form/search';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderProductListFeatureSearchFormConfig {
  readonly #userOrderProductStore = inject(llecoopUserOrderProductStore);
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
            defaultValue: this.#userOrderProductStore.filter()['category'],
            className: 'w-full md:w-1/2',
            props: {
              label: 'Categoría',
              placeholder: 'Categoría',
              required: false,
              options: this.#categories$,
            },
          },
        ],
      },
    ];
  }
}
