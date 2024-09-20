/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { Timestamp } from '@angular/fire/firestore';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { getLlecoopCategoryDetailFormConfig } from './category-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryDetailFacadeService
  implements DetailItemViewFacade<LlecoopProductCategory>
{
  private readonly store = inject(LlecoopCategoryStore);
  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'category')[0];
  model = this.store.selectedItem;

  viewConfig = signal({
    ...this.view,
    title: this.model()?.name || 'Nova categoria',
  });

  formStructure = signal(getLlecoopCategoryDetailFormConfig());

  onSubmit(data: Partial<LlecoopProductCategory>): void {
    this.model()?.id
      ? this.store.update({ ...data, updatedAt: Timestamp.now() })
      : this.store.create({ ...data, createdAt: Timestamp.now() });
  }
}
