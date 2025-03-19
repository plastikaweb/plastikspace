import moment from 'moment';
import { filter, take, tap } from 'rxjs';

import { computed, inject, Injectable, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopOrder, LlecoopProduct, YearWeek } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  StoreOrderListFilter,
} from '@plastik/llecoop/order-list/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { PageEventConfig, TableSorting } from '@plastik/shared/table/entities';

import { getLlecoopOrderListFeatureListSearchFormConfig } from './order-list-feature-list-table/order-list-feature-list-search-form.config';
import { LlecoopOrderListFeatureListTableConfig } from './order-list-feature-list-table/order-list-feature-list-table.config';
import { LlecoopOrderListFeatureListTotalDetailTableConfig } from './order-list-feature-list-total-detail/order-list-feature-list-total-detail-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListFeatureListFacadeService
  implements TableWithFilteringFacade<LlecoopOrder, StoreOrderListFilter>
{
  orderListTotalDetailTableConfig = inject(LlecoopOrderListFeatureListTotalDetailTableConfig);
  totalTableDefinition = this.orderListTotalDetailTableConfig.getTableDefinition();

  readonly #store = inject(llecoopOrderListStore);
  readonly #table = inject(LlecoopOrderListFeatureListTableConfig);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #sanitizer = inject(DomSanitizer);

  viewConfig = signal(inject(VIEW_CONFIG)().filter(item => item.name === 'order-list')[0]);
  routingToDetailPage = signal({ visible: false });
  viewExtraActions = computed(() => [
    {
      label: 'Iniciar comanda',
      icon: 'add',
      execute: () => {
        this.#store.getAvailableProducts();

        this.#confirmService
          .confirm(
            'Iniciar nova comanda',
            this.#sanitizer.bypassSecurityTrustHtml(
              `<div class="flex flex-col gap-sm justify-center items-center rounded-xl p-md">
                <p class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md h5">${this.getNewOrderName()}</p>
                <p class="font-extrabold">Oberta fins el ${this.getNewOrderDate().format('DD/MM/YYYY')}
                a les ${this.getNewOrderDate().format('HH:mm')}</span> hores.</p>
              </div>
              `
            ),
            'Cancel·lar',
            'Iniciar'
          )
          .pipe(
            take(1),
            filter(Boolean),
            tap(() => this.#store.create({ item: this.createOrderList() })),
            tap(() => this.#store.clearAvailableProducts())
          )
          .subscribe();
      },
      disabled: () => !!this.#store.currentOrderList(),
    },
  ]);
  tableDefinition = this.#table.getTableDefinition();
  filterFormConfig = getLlecoopOrderListFeatureListSearchFormConfig();
  filterCriteria = this.#store.filter;

  onChangeFilterCriteria(criteria: StoreOrderListFilter): void {
    this.#store.setFilter(criteria);
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#store.setSorting([active, direction]);
  }

  onTablePagination({ pageIndex, pageSize }: PageEventConfig): void {
    this.#store.setPagination({ pageIndex, pageSize });
  }

  onTableActionDelete(item: LlecoopOrder): void {
    if (item.id) {
      this.#confirmService
        .confirm(
          'Eliminar comanda setmanal',
          `Segur que vols eliminar la comanda "${item.name}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.#store.delete(item));
    }
  }

  private getNewOrderName(): YearWeek {
    const year = moment().year();
    const week = moment().week();

    return `${year.toString().padStart(4, '0')}-${week.toString().padStart(2, '0')}` as YearWeek;
  }

  private getNewOrderDate() {
    return moment().isoWeekday(8).hour(12).minute(0);
  }

  private createOrderList(): LlecoopOrder {
    const availableProducts = this.#store
      .availableProducts()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ stock, isAvailable, ...rest }: LlecoopProduct) => ({
        ...rest,
        initQuantity: 0,
        finalQuantity: 0,
        initPrice: 0,
        finalPrice: 0,
      }));

    return {
      name: this.getNewOrderName(),
      normalizedName: this.getNewOrderName().toLowerCase(),
      endTime: this.getNewOrderDate().toDate(),
      status: 'progress',
      availableProducts,
      orderCount: 0,
    };
  }
}
