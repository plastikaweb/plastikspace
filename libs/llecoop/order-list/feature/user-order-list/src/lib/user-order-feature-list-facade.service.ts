/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable, Signal, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { TableSorting } from '@plastik/shared/table/entities';
import { filter, take } from 'rxjs';
import { getLlecoopUserOrderSearchFeatureFormConfig } from './user-order-feature-search-form.config';
import { LlecoopUserOrderSearchFeatureTableConfig } from './user-order-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderListFacadeService
  implements TableWithFilteringFacade<LlecoopUserOrder>
{
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
  readonly #userOrderStore = inject(LlecoopUserOrderStore);
  readonly #orderListStore = inject(LLecoopOrderListStore);
  readonly #table = inject(LlecoopUserOrderSearchFeatureTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'order')[0]);

  tableDefinition = this.#table.getTableDefinition();
  formStructure = getLlecoopUserOrderSearchFeatureFormConfig();
  filterCriteria = signal<Record<string, string>>({
    text: '',
  });

  tableFilterPredicate = (data: LlecoopUserOrder, criteria: Record<string, string>) => {
    const value = criteria['text'].toLowerCase();
    return [data.name].some(text => text?.toLowerCase().includes(value));
  };
  routingToDetailPage = computed(() => {
    return {
      visible: true,
      label: 'Fer comanda setmanal',
      disabled:
        this.#userOrderStore
          .entities()
          .some(entity => entity['orderListId'] === this.#orderListStore.currentOrder()?.id) ||
        !this.#orderListStore.currentOrder(),
    };
  });

  onTableSorting({ active, direction }: TableSorting): void {
    this.#userOrderStore.setSorting([active, direction]);
  }

  onChangeFilterCriteria(criteria: Record<string, string>): void {
    this.filterCriteria.update(() => criteria);
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
