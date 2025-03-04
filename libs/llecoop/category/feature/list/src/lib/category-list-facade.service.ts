import { filter, take } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { llecoopCategoryStore, StoreCategoryFilter } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { StoreFirebaseCrudPagination } from '@plastik/shared/signal-state-data-access';
import { TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopCategorySearchFeatureFormConfig } from './category-feature-search-form.config';
import { LlecoopCategorySearchFeatureTableConfig } from './category-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryListFacadeService
  implements TableWithFilteringFacade<LlecoopProductCategory, StoreCategoryFilter>
{
  readonly #store = inject(llecoopCategoryStore);
  readonly #table = inject(LlecoopCategorySearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'category')[0]);
  routingToDetailPage = signal({ visible: true });
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = getLlecoopCategorySearchFeatureFormConfig();
  filterCriteria = this.#store.filter;

  onChangeFilterCriteria(criteria: StoreCategoryFilter): void {
    this.#store.setFilter(criteria);
  }

  onChangePagination(pagination: StoreFirebaseCrudPagination<LlecoopProductCategory>): void {
    this.#store.setPagination(pagination);
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#store.setSorting([active, direction]);
  }

  onTableActionDelete(item: LlecoopProductCategory): void {
    if (item.id) {
      this.#confirmService
        .confirm(
          'Eliminar categoria',
          `Segur que vols eliminar "${item.name}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.#store.delete(item));
    }
  }
}
