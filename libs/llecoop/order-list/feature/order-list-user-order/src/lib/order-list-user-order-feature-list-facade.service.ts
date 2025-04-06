import { filter, take } from 'rxjs';

import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { FormConfig } from '@plastik/core/entities';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopOrderProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopUserOrderStore,
  StoreUserOrderFilter,
} from '@plastik/llecoop/order-list/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { PageEventConfig, TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopOrderListUserOrderFeatureListSearchFormConfig } from './order-list-user-order-feature-list-search-form.config';
import { LlecoopOrderListUserOrderFeatureListTableConfig } from './order-list-user-order-feature-list-table.config';
import { OrderListUserOrderResumeFormConfig } from './order-list-user-order-resume/order-list-user-order-resume-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListUserOrderFeatureListFacadeService
  implements TableWithFilteringFacade<LlecoopUserOrder, StoreUserOrderFilter>
{
  readonly #userOrderStore = inject(llecoopUserOrderStore);
  readonly #table = inject(LlecoopOrderListUserOrderFeatureListTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #router = inject(Router);
  readonly #viewConfig = inject(VIEW_CONFIG);
  readonly #viewConfigMainRoute = this.#viewConfig().filter(item => item.name === 'order')[0];
  readonly #viewConfigSubRoute = this.#viewConfigMainRoute.children?.filter(
    item => item.name === 'all-order'
  )[0];
  viewConfig = computed(() => {
    return {
      ...this.#viewConfigSubRoute,
      title: `${this.#viewConfigMainRoute.title}: ${this.#viewConfigSubRoute?.title}`,
    };
  });
  routingToDetailPage = signal({
    visible: false,
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
  filterFormConfig = getLlecoopOrderListUserOrderFeatureListSearchFormConfig();
  filterCriteria = this.#userOrderStore.filter;
  orderListDetailUserOrderDetailFormStructure: FormConfig<LlecoopOrderProduct> = inject(
    OrderListUserOrderResumeFormConfig
  ).get();

  onChangeFilterCriteria(criteria: StoreUserOrderFilter): void {
    this.#router.navigate([], {
      queryParams: { ...criteria, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
  }

  onChangePagination({ pageIndex, pageSize }: PageEventConfig): void {
    this.#router.navigate([], {
      queryParams: { pageIndex, pageSize },
      queryParamsHandling: 'merge',
    });
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#router.navigate([], {
      queryParams: { active, direction, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
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

  onSaveUserOrder(model: Pick<LlecoopUserOrder, 'id' | 'cart' | 'orderListId'>): void {
    this.#userOrderStore.update({
      item: { ...model, status: 'reviewed' },
      redirectUrl: '/comandes/totes',
    });
  }
}
