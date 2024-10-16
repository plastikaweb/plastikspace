/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable, Signal, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { LLecoopOrderListStore, LlecoopOrderStore } from '@plastik/llecoop/order-list/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { TableSorting } from '@plastik/shared/table/entities';
import { getLlecoopOrderSearchFeatureFormConfig } from './order-feature-search-form.config';
import { LlecoopOrderSearchFeatureTableConfig } from './order-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListFacadeService implements TableWithFilteringFacade<LlecoopUserOrder> {
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
  private readonly store = inject(LlecoopOrderStore);
  private readonly orderListStore = inject(LLecoopOrderListStore);
  private readonly table = inject(LlecoopOrderSearchFeatureTableConfig);
  private readonly confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'order')[0]);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.entities;
  tableSorting = this.store.sorting;
  count = this.store.count;
  routingToDetailPage = computed(() => {
    return {
      visible: true,
      label: 'Fer comanda setmanal',
      disabled:
        this.store
          .entities()
          .some(entity => entity['orderListId'] === this.orderListStore.currentOrder()?.id) &&
        this.orderListStore.entities().some(entity => entity.status === 'progress'),
    };
  });
  formStructure = getLlecoopOrderSearchFeatureFormConfig();

  onTableSorting({ active, direction }: TableSorting): void {
    this.store.setSorting([active, direction]);
  }

  // onTableActionDelete(item: LlecoopProduct): void {
  //   if (item.id) {
  //     this.confirmService
  //       .confirm(
  //         'Eliminar producte',
  //         `Segur que vols eliminar "${item.name}"?`,
  //         'Cancel·lar',
  //         'Eliminar'
  //       )
  //       .pipe(take(1), filter(Boolean))
  //       .subscribe(() => this.store.delete(item));
  //   }
  // }
}
