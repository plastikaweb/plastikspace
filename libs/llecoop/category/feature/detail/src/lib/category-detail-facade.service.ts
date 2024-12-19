/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { categoryFeatureDetailFormConfig } from './category-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryDetailFacadeService
  implements DetailItemViewFacade<LlecoopProductCategory>
{
  readonly #store = inject(LlecoopCategoryStore);
  readonly #view = inject(VIEW_CONFIG)().filter(item => item.name === 'category')[0];
  model = this.#store.selectedItem;

  viewConfig = computed(() => ({
    ...this.#view,
    title: this.model()?.name || 'Nova categoria',
  }));

  formConfig = categoryFeatureDetailFormConfig();

  onSubmit(data: Partial<LlecoopProductCategory>): void {
    this.model()?.id ? this.#store.update(data) : this.#store.create(data);
  }
}
