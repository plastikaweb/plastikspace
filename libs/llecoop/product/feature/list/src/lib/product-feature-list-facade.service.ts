/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { FilterArrayPipeConfig } from '@plastik/shared/filter-array-pipe';
import { TableSorting } from '@plastik/shared/table/entities';
import { LlecoopProductSearchFeatureTableConfig } from './product-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductListFacadeService implements TableWithFilteringFacade<LlecoopProduct> {
  private readonly store = inject(LlecoopProductStore);
  private readonly table = inject(LlecoopProductSearchFeatureTableConfig);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'product')[0]);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.entities;
  tableSorting = this.store.sorting;
  tableFilter = this.store.filter;
  count = this.store.count;

  onSorting(sorting: TableSorting): void {
    this.store.setSorting(sorting);
  }

  onSearch(searchCriteria: object): void {
    const filtering = this.formatSearchCriteria(searchCriteria);
    this.store.setFilter(filtering);
  }

  private formatSearchCriteria(searchCriteria: object): FilterArrayPipeConfig<LlecoopProduct>[] {
    return Object.entries(searchCriteria).map(([key, value]) => {
      return {
        fields: this.tableStructure().filter?.[key] || [],
        value,
      };
    });
  }
}
