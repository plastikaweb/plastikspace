/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable, signal } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { TableWithFilteringFacade } from '@plastik/core/list-view';
import { LlecoopOrder } from '@plastik/llecoop/entities';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { TableSorting } from '@plastik/shared/table/entities';
import moment from 'moment';
import { filter, take } from 'rxjs';
import { getLlecoopOrderListSearchFeatureFormConfig } from './order-list-feature-search-form.config';
import { LlecoopOrderListSearchFeatureTableConfig } from './order-list-feature-table.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListListFacadeService implements TableWithFilteringFacade<LlecoopOrder> {
  private readonly store = inject(LLecoopOrderListStore);
  private readonly productStore = inject(LlecoopProductStore);
  private readonly table = inject(LlecoopOrderListSearchFeatureTableConfig);
  private readonly confirmService = inject(SharedConfirmDialogService);
  private readonly sanitizer = inject(DomSanitizer);

  viewConfig = signal(inject(VIEW_CONFIG).filter(item => item.name === 'order-list')[0]);

  tableDefinition = this.table.getTableDefinition();
  filterCriteria = signal<Record<string, string>>({
    text: '',
  });
  tableFilterPredicate = (data: LlecoopOrder, criteria: Record<string, string>) => {
    const value = criteria['text'].toLowerCase();
    return [data.name].some(text => text?.toLowerCase().includes(value));
  };
  routingToDetailPage = signal({ visible: false });

  viewExtraActions = signal([
    {
      label: 'Iniciar comanda',
      icon: 'add',
      execute: () => {
        this.confirmService
          .confirm(
            'Iniciar nova comanda',
            this.sanitizer.bypassSecurityTrustHtml(
              `<div class="flex flex-col gap-sm justify-center items-center bg-secondary-light rounded-xl p-md">
                <h5 class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md">${this.getNewOrderName()}</h5>
                <p class="font-extrabold">Oberta fins el ${this.getNewOrderDate().format('DD/MM/YYYY')}
                a les ${this.getNewOrderDate().format('HH:mm')}</span> hores.</p>
                <p class="text-secondary-dark">Els productes marcats com a disponibles s'afegiran a la llista.</p>
              </div>
              `
            ),
            'Cancel·lar',
            'Iniciar'
          )
          .pipe(take(1), filter(Boolean))
          .subscribe(() => this.store.create(this.createOrderList()));
      },
      disabled: () =>
        this.store.entities().some(({ status }) => status === 'waiting' || status === 'progress'),
    },
  ]);

  formStructure = getLlecoopOrderListSearchFeatureFormConfig();

  onTableSorting({ active, direction }: TableSorting): void {
    this.store.setSorting([active, direction]);
  }

  onChangeFilterCriteria(criteria: Record<string, string>): void {
    this.filterCriteria.update(() => criteria);
  }

  onTableActionDelete(item: LlecoopOrder): void {
    if (item.id) {
      this.confirmService
        .confirm(
          'Eliminar comanda setmanal',
          `Segur que vols eliminar la comanda "${item.name}"?`,
          'Cancel·lar',
          'Eliminar'
        )
        .pipe(take(1), filter(Boolean))
        .subscribe(() => this.store.delete(item));
    }
  }

  private getNewOrderName(): string {
    const nextWeek = moment().add(1, 'weeks');
    const weekNumber = nextWeek.isoWeek();
    const year = nextWeek.year();

    return `Comanda setmana #${weekNumber}-${year}`;
  }

  private getNewOrderDate() {
    return moment().isoWeekday(8).hour(12).minute(0);
  }

  private createOrderList(): LlecoopOrder {
    const availableProducts = this.productStore
      .getAvailableProducts()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ stock, isAvailable, ...rest }) => ({
        ...rest,
        initQuantity: 0,
        finalQuantity: 0,
        initPrice: 0,
        finalPrice: 0,
      }));

    return {
      name: this.getNewOrderName(),
      endTime: this.getNewOrderDate().toDate(),
      status: 'waiting',
      availableProducts,
    };
  }
}
