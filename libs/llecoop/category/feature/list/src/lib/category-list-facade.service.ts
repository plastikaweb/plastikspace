/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { TableSorting } from '@plastik/shared/table/entities';
import { getLlecoopCategorySearchFeatureFormConfig } from './category-feature-search-form.config';
import { LlecoopCategorySearchFeatureTableConfig } from './category-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryListFacadeService
  implements TableWithFilteringFacade<LlecoopProductCategory>
{
  private readonly store = inject(LlecoopCategoryStore);
  private readonly table = inject(LlecoopCategorySearchFeatureTableConfig);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'category')[0]);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.entities;
  tableSorting = this.store.sorting;
  count = this.store.count;

  formStructure = getLlecoopCategorySearchFeatureFormConfig();

  onSorting({ active, direction }: TableSorting): void {
    this.store.setSorting([active, direction]);
  }
}
