import { filter, take } from 'rxjs';

import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopUserOrderStore,
  StoreUserOrderFilter,
} from '@plastik/llecoop/order-list/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { StoreFirebaseCrudPagination } from '@plastik/shared/signal-state-data-access';
import { TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopUserOrderSearchFeatureFormConfig } from './user-order-feature-search-form.config';
import { LlecoopUserOrderSearchFeatureTableConfig } from './user-order-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderListFacadeService
  implements TableWithFilteringFacade<LlecoopUserOrder, StoreUserOrderFilter>
{
  readonly #store = inject(llecoopUserOrderStore);
  readonly #table = inject(LlecoopUserOrderSearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'order')[0]);
  routingToDetailPage = computed(() => {
    return {
      visible: true,
      label: 'Fer comanda setmanal',
      disabled: !!this.#store.currentUserOrder(),
    };
  });
  viewExtraActions?:
    | Signal<
        {
          label: string;
          icon: string;
          execute: (element?: LlecoopUserOrder | undefined) => void;
          disabled: (element?: LlecoopUserOrder | undefined) => boolean;
        }[]
      >
    | undefined;
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = getLlecoopUserOrderSearchFeatureFormConfig();
  filterCriteria = this.#store.filter;

  onChangeFilterCriteria(criteria: StoreUserOrderFilter): void {
    this.#store.setFilter(criteria);
  }

  onChangePagination(pagination: StoreFirebaseCrudPagination<LlecoopUserOrder>): void {
    this.#store.setPagination(pagination);
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#store.setSorting([active, direction]);
  }

  onTableActionDelete(item: LlecoopUserOrder): void {
    if (item.id) {
      this.#confirmService
        .confirm(
          'Eliminar comanda',
          `Segur que vols eliminar la comanda "${item.name}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.#store.delete(item));
    }
  }
}
