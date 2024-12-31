import { filter, take } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { latinize } from '@plastik/shared/latinize';
import { TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopProductSearchFeatureFormConfig } from './product-feature-search-form.config';
import { LlecoopProductSearchFeatureTableConfig } from './product-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductListFacadeService implements TableWithFilteringFacade<LlecoopProduct> {
  readonly #store = inject(LlecoopProductStore);
  readonly #table = inject(LlecoopProductSearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'product')[0]);
  routingToDetailPage = signal({ visible: true });
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = getLlecoopProductSearchFeatureFormConfig();
  filterCriteria = signal<Record<string, string>>({
    text: '',
    inStock: 'all',
  });
  tableFilterPredicate = (data: LlecoopProduct, criteria: Record<string, string>) => {
    let filterText = true;
    let filterInStock = true;
    for (const key in criteria) {
      const value = criteria[key].toLowerCase();

      if (key === 'text') {
        filterText = [data.name, data.category?.name, data.info, data.provider, data.origin].some(
          text => latinize(text?.toLowerCase() || '').includes(value)
        );
      }
      if (key === 'inStock') {
        filterInStock =
          value === 'all' ||
          (value === 'available' && data.isAvailable) ||
          (value === 'not-available' && !data.isAvailable);
      }
    }

    return filterText && filterInStock;
  };

  onChangeFilterCriteria(criteria: Record<string, string>): void {
    this.filterCriteria.update(() => criteria);
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
