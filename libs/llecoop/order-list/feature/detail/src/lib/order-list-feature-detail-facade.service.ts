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

import { getLlecoopOrderListFeatureDetailSearchFormConfig } from './order-list-feature-detail-table/order-list-feature-detail-search-form.config';
import { LlecoopOrderListFeatureDetailTableConfig } from './order-list-feature-detail-table/order-list-feature-detail-table.config';
import { OrderListFeatureDetailUserOrderDetailFormConfig } from './order-list-feature-detail-user-order-detail/order-list-feature- detail-user-order-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListFeatureDetailFacadeService
  implements TableWithFilteringFacade<LlecoopUserOrder>
{
  readonly #orderListStore = inject(LLecoopOrderListStore);
  readonly #userOrderStore = inject(LlecoopUserOrderStore);
  readonly #table = inject(LlecoopOrderListFeatureDetailTableConfig);
  readonly #mainViewConfig = signal(
    inject(VIEW_CONFIG)().filter(item => item.name === 'order-list')[0]
  );

  // specific properties not included in TableWithFilteringFacade
  orderLIstDetailUserOrderDetailFormStructure: FormConfig<LlecoopOrderProduct> = inject(
    OrderListFeatureDetailUserOrderDetailFormConfig
  ).get();

  viewConfig = computed(() => ({
    ...this.#mainViewConfig(),
    title: this.setTitle(this.#orderListStore.selectedItem()),
  }));
  routingToDetailPage = signal({ visible: true });
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = getLlecoopOrderListFeatureDetailSearchFormConfig();
  filterCriteria = signal<Record<string, string>>({
    text: '',
  });
  tableFilterPredicate = (data: LlecoopUserOrder, criteria: Record<string, string>) => {
    const value = criteria['text'].toLowerCase();
    return [data.address, data.userName].some(text => text?.toLowerCase().includes(value));
  };

  onChangeFilterCriteria(criteria: Record<string, string>): void {
    this.filterCriteria.update(() => criteria);
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#orderListStore.setSorting([active, direction]);
  }

  // specific methods not included in TableWithFilteringFacade
  onSaveUserOrder(model: Pick<LlecoopUserOrder, 'id' | 'cart' | 'orderListId'>): void {
    this.#userOrderStore.update({ ...model, status: 'review' });
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
