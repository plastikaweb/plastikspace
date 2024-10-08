/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { TableSorting } from '@plastik/shared/table/entities';
import { filter, take } from 'rxjs';
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
  private readonly confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'category')[0]);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.entities;
  tableSorting = this.store.sorting;
  count = this.store.count;
  routingToDetailPage = signal({ visible: true });

  formStructure = getLlecoopCategorySearchFeatureFormConfig();

  onTableSorting({ active, direction }: TableSorting): void {
    this.store.setSorting([active, direction]);
  }

  onTableActionDelete(item: LlecoopProductCategory): void {
    if (item.id) {
      this.confirmService
        .confirm(
          'Eliminar categoria',
          `Segur que vols eliminar "${item.name}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.store.delete(item));
    }
  }
}
