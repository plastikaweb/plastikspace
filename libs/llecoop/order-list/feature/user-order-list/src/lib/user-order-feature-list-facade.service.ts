import { filter, take } from 'rxjs';

import { computed, inject, Injectable, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
  StoreUserOrderFilter,
} from '@plastik/llecoop/order-list/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { PageEventConfig, TableSorting } from '@plastik/shared/table/entities';

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
  readonly #router = inject(Router);
  readonly #viewConfig = inject(VIEW_CONFIG);
  readonly #viewConfigMainRoute = this.#viewConfig().filter(item => item.name === 'order')[0];
  readonly #viewConfigSubRoute = this.#viewConfigMainRoute.children?.filter(
    item => item.name === 'my-order'
  )[0];
  viewConfig = computed(() => {
    return {
      ...this.#viewConfigSubRoute,
      title: this.#viewConfigSubRoute?.title
        ? `${this.#viewConfigMainRoute.title}: ${this.#viewConfigSubRoute?.title}`
        : this.#viewConfigMainRoute.title,
    };
  });
  routingToDetailPage = computed(() => {
    return {
      visible: true,
      label: this.#userOrderStore.currentUserOrder()
        ? 'Editar comanda setmanal'
        : 'Fer comanda setmanal',
      disabled: !this.#orderListStore.currentOrderList(),
      path: this.#userOrderStore.currentUserOrder()
        ? [`./${this.#userOrderStore.currentUserOrder()?.id}`]
        : ['./crear'],
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
    this.#router.navigate([], { queryParams: criteria });
  }

  onChangePagination({ pageIndex, pageSize }: PageEventConfig): void {
    this.#router.navigate([], {
      queryParams: { pageIndex, pageSize },
      queryParamsHandling: 'merge',
    });
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#router.navigate([], {
      queryParams: { active, direction },
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
}
