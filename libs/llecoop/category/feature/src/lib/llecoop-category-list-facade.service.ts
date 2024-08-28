/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';

import { ProductCategory } from '@plastik/llecoop/entities';
import { TableWithFilteringFacade } from '@plastik/shared/list-view';
import { LlecoopCategorySearchFeatureTableConfig } from './llecoop-category-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryListFacadeService implements TableWithFilteringFacade<ProductCategory> {
  private readonly store = inject(LlecoopCategoryStore);
  private readonly table = inject(LlecoopCategorySearchFeatureTableConfig);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.categories;
  count = this.store.count;
  viewName = 'categories';

  constructor() {
    this.store.getAll();
  }
}
