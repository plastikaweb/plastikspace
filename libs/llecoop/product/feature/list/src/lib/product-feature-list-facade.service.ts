/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { TableSorting } from '@plastik/shared/table/entities';
import { filter, take } from 'rxjs';
import { getLlecoopProductSearchFeatureFormConfig } from './product-feature-search-form.config';
import { LlecoopProductSearchFeatureTableConfig } from './product-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductListFacadeService implements TableWithFilteringFacade<LlecoopProduct> {
  private readonly store = inject(LlecoopProductStore);
  private readonly table = inject(LlecoopProductSearchFeatureTableConfig);
  private readonly confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'product')[0]);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.entities;
  tableSorting = this.store.sorting;
  count = this.store.count;
  routingToDetailPage = signal({ visible: true });

  formStructure = getLlecoopProductSearchFeatureFormConfig();

  onTableSorting({ active, direction }: TableSorting): void {
    this.store.setSorting([active, direction]);
  }

  onTableActionDelete(item: LlecoopProduct): void {
    if (item.id) {
      this.confirmService
        .confirm(
          'Eliminar producte',
          `Segur que vols eliminar "${item.name}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.store.delete(item));
    }
  }
}
