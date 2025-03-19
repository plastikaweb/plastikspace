import { filter, take } from 'rxjs';

import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
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
  readonly #userOrderStore = inject(llecoopUserOrderStore);
  readonly #orderListStore = inject(llecoopOrderListStore);
  readonly #table = inject(LlecoopUserOrderSearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'order')[0]);
  routingToDetailPage = computed(() => {
    return {
      visible: true,
      label: !this.#userOrderStore.currentUserOrder()
        ? 'Fer comanda setmanal'
        : 'Editar comanda setmanal',
      disabled: !this.#orderListStore.currentOrderList(),
      path: [`./${this.#userOrderStore.currentUserOrder()?.id}` || ''],
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
  filterCriteria = this.#userOrderStore.filter;

  onChangeFilterCriteria(criteria: StoreUserOrderFilter): void {
    this.#userOrderStore.setFilter(criteria);
  }

  onChangePagination(pagination: StoreFirebaseCrudPagination<LlecoopUserOrder>): void {
    this.#userOrderStore.setPagination(pagination);
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#userOrderStore.setSorting([active, direction]);
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
        .subscribe(() => this.#userOrderStore.delete(item));
    }
  }
}
