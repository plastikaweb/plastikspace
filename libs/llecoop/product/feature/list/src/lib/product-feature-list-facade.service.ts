/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { TableSorting } from '@plastik/shared/table/entities';
import { getLlecoopProductSearchFeatureFormConfig } from './product-feature-search-form.config';
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
  count = this.store.count;

  formStructure = getLlecoopProductSearchFeatureFormConfig();

  onSorting({ active, direction }: TableSorting): void {
    this.store.setSorting([active, direction]);
  }
}
