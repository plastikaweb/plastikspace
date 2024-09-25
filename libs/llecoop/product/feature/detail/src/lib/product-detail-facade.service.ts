/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { getLlecoopProductDetailFormConfig } from './product-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductDetailFacadeService implements DetailItemViewFacade<LlecoopProduct> {
  private readonly store = inject(LlecoopProductStore);
  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'product')[0];
  model = this.store.selectedItem;

  viewConfig = computed(() => {
    return {
      ...this.view,
      title: this.model()?.name || 'Nou producte',
    };
  });

  formStructure = signal(getLlecoopProductDetailFormConfig());

  onSubmit(data: Partial<LlecoopProduct>): void {
    this.model()?.id
      ? this.store.update({
          product: data,
          showNotification: true,
        })
      : this.store.create(data);
  }
}
