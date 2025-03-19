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
  llecoopOrderListStore,
  llecoopUserOrderStore,
  StoreOrderListFilter,
} from '@plastik/llecoop/order-list/data-access';
import { PageEventConfig, TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopOrderListFeatureDetailSearchFormConfig } from './order-list-feature-detail-table/order-list-feature-detail-search-form.config';
import { LlecoopOrderListFeatureDetailTableConfig } from './order-list-feature-detail-table/order-list-feature-detail-table.config';
import { OrderListFeatureDetailUserOrderDetailFormConfig } from './order-list-feature-detail-user-order-detail/order-list-feature- detail-user-order-detail-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListFeatureDetailFacadeService
  implements TableWithFilteringFacade<LlecoopUserOrder, StoreOrderListFilter>
{
  readonly #orderListStore = inject(llecoopOrderListStore);
  readonly #userOrderStore = inject(llecoopUserOrderStore);
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

  onChangeFilterCriteria(criteria: StoreOrderListFilter): void {
    this.#orderListStore.setSelectedItemUserFilter(criteria);
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#orderListStore.setSelectedItemUserSorting([active, direction]);
  }

  onChangePagination({ pageIndex, pageSize }: PageEventConfig): void {
    this.#orderListStore.setSelectedItemUserPagination({
      pageSize,
      pageIndex,
    });
  }

  onSaveUserOrder(model: Pick<LlecoopUserOrder, 'id' | 'cart' | 'orderListId'>): void {
    this.#userOrderStore.update({ ...model, status: 'reviewed' });
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
