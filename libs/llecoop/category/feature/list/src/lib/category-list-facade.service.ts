import { filter, take } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { CategoryStoreFilter, LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopFeatureStorePagination } from '@plastik/llecoop/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopCategorySearchFeatureFormConfig } from './category-feature-search-form.config';
import { LlecoopCategorySearchFeatureTableConfig } from './category-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryListFacadeService
  implements TableWithFilteringFacade<LlecoopProductCategory>
{
  readonly #store = inject(LlecoopCategoryStore);
  readonly #table = inject(LlecoopCategorySearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'category')[0]);
  routingToDetailPage = signal({ visible: true });
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = getLlecoopCategorySearchFeatureFormConfig();
  // filterCriteria = signal<Record<string, string>>({
  //   text: '',
  // });
  // tableFilterPredicate = (data: LlecoopProductCategory, criteria: Record<string, string>) => {
  //   const value = criteria['text'].toLowerCase();
  //   return [data.name, data.description].some(text => text?.toLowerCase().includes(value));
  // };

  onChangeFilterCriteria(criteria: Record<string, string>): void {
    this.#store.setFilter(criteria as CategoryStoreFilter);
  }

  onChangePagination(pagination: LlecoopFeatureStorePagination<LlecoopProductCategory>): void {
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
