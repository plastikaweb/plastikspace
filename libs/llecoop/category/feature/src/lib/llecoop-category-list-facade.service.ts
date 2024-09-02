/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';
import {
  getLlecoopSearchFeatureFormConfig,
  LlecoopCategoryStore,
} from '@plastik/llecoop/category/data-access';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { LlecoopCategorySearchFeatureTableConfig } from '@plastik/llecoop/category/data-access';
import { ProductCategory } from '@plastik/llecoop/entities';
import { FilterArrayPipeConfig } from '@plastik/shared/filter-array-pipe';
import { TableWithFilteringFacade } from '@plastik/shared/list-view';
import { TableSorting } from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryListFacadeService implements TableWithFilteringFacade<ProductCategory> {
  private readonly store = inject(LlecoopCategoryStore);
  private readonly table = inject(LlecoopCategorySearchFeatureTableConfig);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'category')[0]);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.categoryEntities;
  tableSorting = this.store.sorting;
  tableFilter = this.store.filter;
  count = this.store.count;

  formStructure = getLlecoopSearchFeatureFormConfig();

  onSorting(sorting: TableSorting): void {
    this.store.setSorting(sorting);
  }

  onSearch(searchCriteria: object): void {
    const filtering = this.formatSearchCriteria(searchCriteria);
    this.store.setFilter(filtering);
  }

  private formatSearchCriteria(searchCriteria: object): FilterArrayPipeConfig<ProductCategory>[] {
    return Object.entries(searchCriteria).map(([key, value]) => {
      return {
        fields: this.tableStructure().filter?.[key] || [],
        value,
      };
    });
  }
}
