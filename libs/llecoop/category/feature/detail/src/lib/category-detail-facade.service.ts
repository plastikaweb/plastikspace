/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { DetailItemViewFacade } from '@plastik/core/detail-edit-view';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { getLlecoopDetailFormConfig } from './category-feature-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryDetailFacadeService
  implements DetailItemViewFacade<LlecoopProductCategory>
{
  private readonly store = inject(LlecoopCategoryStore);
  private readonly view = inject(VIEW_CONFIG).filter(item => item.name === 'category')[0];

  viewConfig = signal({
    ...this.view,
    title: 'Nova categoria',
  });

  formStructure = getLlecoopDetailFormConfig();

  onSubmit(data: Partial<LlecoopProductCategory>): void {
    this.store.create(data);
  }
}
