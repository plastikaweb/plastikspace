import { filter, take } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { llecoopCategoryStore, StoreCategoryFilter } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { PageEventConfig, TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopCategorySearchFeatureFormConfig } from './category-feature-search-form.config';
import { LlecoopCategorySearchFeatureTableConfig } from './category-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryListFacadeService
  implements TableWithFilteringFacade<LlecoopProductCategory, StoreCategoryFilter>
{
  readonly #categoryStore = inject(llecoopCategoryStore);
  readonly #table = inject(LlecoopCategorySearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #router = inject(Router);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'category')[0]);
  routingToDetailPage = signal({ visible: true, label: 'Afegir categoria' });
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = getLlecoopCategorySearchFeatureFormConfig();
  filterCriteria = this.#categoryStore.filter;

  onChangeFilterCriteria(criteria: StoreCategoryFilter): void {
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
        .subscribe(() => this.#categoryStore.delete(item));
    }
  }
}
