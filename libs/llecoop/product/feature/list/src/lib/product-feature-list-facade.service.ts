import { filter, take } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { llecoopProductStore, StoreProductFilter } from '@plastik/llecoop/product/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { StoreFirebaseCrudPagination } from '@plastik/shared/signal-state-data-access';
import { TableSorting } from '@plastik/shared/table/entities';

import { LlecoopProductSearchFeatureFormConfig } from './product-feature-search-form.config';
import { LlecoopProductSearchFeatureTableConfig } from './product-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductListFacadeService
  implements TableWithFilteringFacade<LlecoopProduct, StoreProductFilter>
{
  readonly #store = inject(llecoopProductStore);
  readonly #table = inject(LlecoopProductSearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #formConfig = inject(LlecoopProductSearchFeatureFormConfig);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'product')[0]);
  routingToDetailPage = signal({ visible: true });
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = this.#formConfig.getConfig();
  filterCriteria = this.#store.filter;

  onChangeFilterCriteria(criteria: StoreProductFilter): void {
    this.#store.setFilter(criteria);
  }

  onChangePagination(pagination: StoreFirebaseCrudPagination<LlecoopProduct>): void {
    this.#store.setPagination(pagination);
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#store.setSorting([active, direction]);
  }

  onTableActionDelete(item: LlecoopProduct): void {
    if (item.id) {
      this.#confirmService
        .confirm(
          'Eliminar producte',
          `Segur que vols eliminar "${item.name}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.#store.delete(item));
    }
  }
}
