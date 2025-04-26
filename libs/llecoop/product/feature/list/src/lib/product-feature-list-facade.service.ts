import { filter, take } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { llecoopProductStore, StoreProductFilter } from '@plastik/llecoop/product/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { PageEventConfig, TableSorting } from '@plastik/shared/table/entities';

import { LlecoopProductSearchFeatureFormConfig } from './product-feature-search-form.config';
import { LlecoopProductSearchFeatureTableConfig } from './product-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductListFacadeService
  implements TableWithFilteringFacade<LlecoopProduct, StoreProductFilter>
{
  readonly #productStore = inject(llecoopProductStore);
  readonly #table = inject(LlecoopProductSearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #router = inject(Router);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'product')[0]);
  routingToDetailPage = signal({ visible: true, label: 'Afegir producte' });
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = inject(LlecoopProductSearchFeatureFormConfig).getConfig();
  filterCriteria = this.#productStore.filter;

  onChangeFilterCriteria(criteria: StoreProductFilter): void {
    this.#router.navigate([], {
      queryParams: { ...criteria, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
  }

  onChangePagination({ pageIndex, pageSize }: PageEventConfig): void {
    this.#router.navigate([], {
      queryParams: { pageIndex, pageSize },
      queryParamsHandling: 'merge',
    });
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#router.navigate([], {
      queryParams: { active, direction, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
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
        .subscribe(() => this.#productStore.delete(item));
    }
  }
}
