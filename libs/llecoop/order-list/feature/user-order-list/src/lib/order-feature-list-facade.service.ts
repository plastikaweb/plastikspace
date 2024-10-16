/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable, Signal, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopOrderUserStore,
} from '@plastik/llecoop/order-list/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { TableSorting } from '@plastik/shared/table/entities';
import { filter, take } from 'rxjs';
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
  private readonly orderUserStore = inject(LlecoopOrderUserStore);
  private readonly orderListStore = inject(LLecoopOrderListStore);
  private readonly table = inject(LlecoopOrderSearchFeatureTableConfig);
  private readonly confirmService = inject(SharedConfirmDialogService);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'order')[0]);

  tableStructure = this.table.getTableStructure();
  tableData = this.orderUserStore.entities;
  tableSorting = this.orderUserStore.sorting;
  count = this.orderUserStore.count;
  routingToDetailPage = computed(() => {
    return {
      visible: true,
      label: 'Fer comanda setmanal',
      disabled:
        this.orderUserStore
          .entities()
          .some(entity => entity['orderListId'] === this.orderListStore.currentOrder()?.id) &&
        this.orderListStore.entities().some(entity => entity.status === 'progress'),
    };
  });
  formStructure = getLlecoopOrderSearchFeatureFormConfig();

  onTableSorting({ active, direction }: TableSorting): void {
    this.orderUserStore.setSorting([active, direction]);
  }

  onTableActionDelete(item: LlecoopUserOrder): void {
    if (item.id) {
      this.confirmService
        .confirm(
          'Eliminar comanda',
          `Segur que vols eliminar la comanda "${item.name}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.orderUserStore.delete(item));
    }
  }
}
