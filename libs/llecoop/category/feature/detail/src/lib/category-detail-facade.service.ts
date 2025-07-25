import { computed, inject, Injectable } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';

import { categoryFeatureDetailFormConfig } from './category-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryDetailFacadeService
  implements DetailItemViewFacade<LlecoopProductCategory>
{
  readonly #store = inject(llecoopCategoryStore);
  readonly #view = inject(VIEW_CONFIG)().filter(item => item.name === 'category')[0];
  model = this.#store.selectedItem;

  viewConfig = computed(() => ({
    ...this.#view,
    title: this.model()?.name || 'Nova categoria',
  }));

  formConfig = categoryFeatureDetailFormConfig(!this.model()?.id);

  onSubmit(item: Partial<LlecoopProductCategory>): void {
    if (this.model()?.id) {
      this.#store.update({ item });
    } else {
      this.#store.create({ item });
    }
  }
}
