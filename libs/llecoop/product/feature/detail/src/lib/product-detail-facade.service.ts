import { computed, inject, Injectable } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';

import { productFeatureDetailFormConfig } from './product-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductDetailFacadeService implements DetailItemViewFacade<LlecoopProduct> {
  readonly #store = inject(LlecoopProductStore);
  readonly #view = inject(VIEW_CONFIG)().filter(item => item.name === 'product')[0];
  model = this.#store.selectedItem;

  viewConfig = computed(() => {
    return {
      ...this.#view,
      title: this.model()?.name || 'Nou producte',
    };
  });

  formConfig = productFeatureDetailFormConfig();

  onSubmit(data: Partial<LlecoopProduct>): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category, ...product } = data;
    this.model()?.id
      ? this.#store.update({
          product,
          showNotification: true,
        })
      : this.#store.create(data);
  }
}
