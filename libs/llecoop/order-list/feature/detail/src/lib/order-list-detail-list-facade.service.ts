/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable, signal } from '@angular/core';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { FormConfig } from '@plastik/core/entities';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import {
  LlecoopOrder,
  LlecoopOrderProduct,
  llecoopOrderStatus,
  LlecoopUserOrder,
} from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { TableSorting } from '@plastik/shared/table/entities';
import { OrderListUserOrderDetailFormConfig } from './order-list-nested-view/order-list-user-order-feature-detail-form.config';
import { getLlecoopOrderListDetailSearchFeatureFormConfig } from './order-list-table-view/order-list-detail-feature-search-form.config';
import { LlecoopOrderListOrderDetailSearchFeatureTableConfig } from './order-list-table-view/order-list-order-detail-table-search.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListDetailListFacadeService
  implements TableWithFilteringFacade<LlecoopUserOrder>
{
  private readonly orderListStore = inject(LLecoopOrderListStore);
  private readonly userOrderStore = inject(LlecoopUserOrderStore);
  private readonly table = inject(LlecoopOrderListOrderDetailSearchFeatureTableConfig);
  private readonly mainViewConfig = signal(
    inject(VIEW_CONFIG).filter(item => item.name === 'order-list')[0]
  );

  orderDetailFormStructure: FormConfig<LlecoopOrderProduct> = inject(
    OrderListUserOrderDetailFormConfig
  ).get();

  viewConfig = computed(() => ({
    ...this.mainViewConfig(),
    title: this.setTitle(this.orderListStore.selectedItem()),
  }));

  tableDefinition = this.table.getTableDefinition();

  filterCriteria = signal<Record<string, string>>({
    text: '',
  });

  tableFilterPredicate = (data: LlecoopUserOrder, criteria: Record<string, string>) => {
    const value = criteria['text'].toLowerCase();
    return [data.address, data.userName].some(text => text?.toLowerCase().includes(value));
  };

  routingToDetailPage = signal({ visible: true });

  tableSearchFormStructure = getLlecoopOrderListDetailSearchFeatureFormConfig();

  onTableSorting({ active, direction }: TableSorting): void {
    this.orderListStore.setSorting([active, direction]);
  }

  onChangeFilterCriteria(criteria: Record<string, string>): void {
    this.filterCriteria.update(() => criteria);
  }

  onSaveUserOrder(model: Pick<LlecoopUserOrder, 'id' | 'cart' | 'orderListId'>): void {
    this.userOrderStore.update({ ...model, status: 'review' });
  }

  private setTitle(order: LlecoopOrder | null): string {
    if (!order) return '';

    const status = llecoopOrderStatus[order.status as LlecoopOrder['status']];
    return `
      <div class="flex gap-tiny justify-center items-center">
        <span>Comanda #${order.name}</span>
        <span class="material-icons ${status.class}">${status.icon}</span>
      </div>
    `;
  }
}
