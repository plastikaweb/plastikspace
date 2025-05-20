import { addDays, format, getWeek, getYear, setHours, setMinutes } from 'date-fns';
import { filter, take, tap } from 'rxjs';

import { computed, inject, Injectable, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  readonly #router = inject(Router);
  readonly #viewConfig = inject(VIEW_CONFIG);
  readonly #viewConfigMainRoute = this.#viewConfig().filter(item => item.name === 'order')[0];
  readonly #viewConfigSubRoute = this.#viewConfigMainRoute.children?.filter(
    item => item.name === 'order-list'
  )[0];
  viewConfig = computed(() => {
    return {
      ...this.#viewConfigSubRoute,
      title: `${this.#viewConfigMainRoute.title}: ${this.#viewConfigSubRoute?.title}`,
    };
  });
  routingToDetailPage = signal({ visible: false });
  viewExtraActions = computed(() => [
    {
      label: 'Iniciar comanda setmanal',
      icon: 'add',
      execute: () => {
        this.#store.getAvailableProducts();

        this.#confirmService
          .confirm(
            'Iniciar nova comanda',
            this.#sanitizer.bypassSecurityTrustHtml(
              `<div class="flex flex-col gap-sm justify-center items-center rounded-xl p-md">
                <p class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md h5">${this.getNewOrderName()}</p>
                <p class="font-extrabold">Oberta fins el ${format(this.getNewOrderDate(), 'dd/MM/yyyy')}
                a les ${format(this.getNewOrderDate(), 'HH:mm')}</span> hores.</p>
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
    this.#router.navigate([], {
      queryParams: { ...criteria, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
  }

  onTableSorting({ active, direction }: TableSorting): void {
    this.#router.navigate([], {
      queryParams: { active, direction, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
  }

  onTablePagination({ pageIndex, pageSize }: PageEventConfig): void {
    this.#router.navigate([], {
      queryParams: { pageIndex, pageSize },
      queryParamsHandling: 'merge',
    });
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
    const now = new Date();
    const year = getYear(now);
    const week = getWeek(now, { weekStartsOn: 1 }); // La semana empieza en lunes

    return `${year.toString().padStart(4, '0')}-${week.toString().padStart(2, '0')}` as YearWeek;
  }

  private getNewOrderDate(): Date {
    const now = new Date();
    const nextMonday = addDays(now, (8 - now.getDay()) % 7 || 7);
    return setHours(setMinutes(nextMonday, 0), 12);
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
      endTime: this.getNewOrderDate(),
      status: 'progress',
      availableProducts,
      orderCount: 0,
    };
  }
}
