import { filter, take } from 'rxjs';

import { inject, Injectable, Signal, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LlecoopOrder } from '@plastik/llecoop/entities';
import { UiOrderListOrdersStatusResumeComponent } from '@plastik/llecoop/order-list-orders-status-resume';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { UserOrderUtilsService } from '@plastik/llecoop/order-list/util';
import { createdAt, createFirebaseTimestampTableColumn } from '@plastik/llecoop/util';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  DEFAULT_TABLE_CONFIG,
  TableColumnFormatting,
  TableDefinition,
  TableStructureConfig,
} from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListFeatureListTableConfig implements TableStructureConfig<LlecoopOrder> {
  readonly #store = inject(llecoopOrderListStore);
  readonly #sanitizer = inject(DomSanitizer);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #userOrderUtilsService = inject(UserOrderUtilsService);
  readonly #router = inject(Router);

  readonly #name: TableColumnFormatting<LlecoopOrder, 'LINK'> = {
    key: 'name',
    title: 'Nom',
    pathToKey: 'name',
    sorting: 'normalizedName',
    sticky: true,
    cssClasses: ['min-w-[80px] @lg:min-w-[105px]'],
    link: () => ['/comandes', 'totes'],
    queryParams: (order?: LlecoopOrder) => ({ text: order?.name || '' }),
    formatting: {
      type: 'LINK',
      execute: (_, order) =>
        `<p class="font-bold uppercase" aria-label="Veure totes les comandes de la setmana ${order?.name}">${order?.name}</p>`,
    },
  };

  readonly #status = this.#userOrderUtilsService.formatOrderStatus<LlecoopOrder>();

  readonly #endTime = createFirebaseTimestampTableColumn<LlecoopOrder>({
    key: 'endTime',
    title: 'Data de tancament',
    pathToKey: 'endTime',
  });

  readonly #orderCount: TableColumnFormatting<LlecoopOrder, 'TEXT'> = {
    key: 'orderCount',
    title: 'Comandes realitzades',
    pathToKey: 'orderCount',
    sorting: 'orderCount',
    cssClasses: ['hidden @lg:flex @lg:min-w-[110px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #userOrdersStatus: TableColumnFormatting<LlecoopOrder, 'COMPONENT'> = {
    key: 'userOrdersStatus',
    title: 'Estat de les comandes',
    pathToKey: 'userOrdersStatus',
    sorting: 'userOrdersStatus',
    cssClasses: ['flex min-w-[180px]'],
    formatting: {
      type: 'COMPONENT',
      execute: (_, element) => {
        return {
          component: UiOrderListOrdersStatusResumeComponent,
          inputs: {
            orderName: element?.name,
            ordersStatus: element?.userOrdersStatus,
          },
        };
      },
    },
  };

  readonly #availableProducts: TableColumnFormatting<LlecoopOrder, 'CUSTOM'> = {
    key: 'availableProducts',
    title: 'Productes inclosos',
    pathToKey: 'availableProducts',
    cssClasses: ['hidden @xl:flex @xl:min-w-[110px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, item) => item?.availableProducts.length || 0,
    },
  };

  readonly #createdAt = createdAt<LlecoopOrder>();

  readonly #columnProperties: Signal<TableColumnFormatting<LlecoopOrder, FormattingTypes>[]> =
    signal([
      this.#name,
      this.#status,
      this.#endTime,
      this.#availableProducts,
      this.#orderCount,
      this.#userOrdersStatus,
      this.#createdAt,
    ]);

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      sort: this.#store.sorting,
      pagination: this.#store.pagination,
      caption: 'Llistat de comandes setmanals',
      count: this.#store.count,
      getData: () => this.#store.entities(),
      actionsColStyles: 'min-w-[180px] max-w-[200px]',
      actions: {
        SET_STATUS: {
          visible: () => true,
          disabled: order => order.status !== 'waiting' && order.status !== 'progress',
          description: order =>
            order.status === 'waiting'
              ? `Activar la comanda "${order.name}"`
              : `Ficar la comanda "${order.name}" en pausa`,
          order: 1,
          icon: order => (order.status === 'waiting' ? 'play_circle' : 'pause_circle'),
          execute: (order: LlecoopOrder) => {
            this.#confirmService
              .confirm(
                order.status === 'waiting' ? 'Activar comanda' : 'Desactivar comanda',
                order.status === 'waiting'
                  ? this.#sanitizer.bypassSecurityTrustHtml(
                      `<div class="flex flex-col gap-sm justify-center items-center rounded-xl p-md">
                    <p class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md text-center leading-6 text-balance">Segur que vols activar <nobr>la comanda "${order.name}" ?</nobr></p>
                    <p class="text-center">Un cop activada es podrà tornar a pausar fins la data de tancament.</p>
                  </div>
                `
                    )
                  : this.#sanitizer.bypassSecurityTrustHtml(
                      `<div class="flex flex-col gap-sm justify-center items-center rounded-xl p-md">
                    <p class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md text-center leading-6 text-balance">Segur que vols ficar en pausa <nobr>la comanda "${order.name}" ?</nobr></p>
                    <p class="text-center">La podràs tornar a activar en qualsevol moment fins la data de tancament.</p>
                  </div>
                `
                    ),
                'Cancel·lar',
                'Acceptar'
              )
              .pipe(take(1), filter(Boolean))
              .subscribe(() => this.#store.changeStatus(order));
          },
        },
        VIEW_ORDER_LIST_USER_ORDERS: {
          visible: () => true,
          description: (order: LlecoopOrder) => `Editar les comandes de ${order.name}`,
          icon: () => 'edit',
          execute: (order: LlecoopOrder) => {
            this.#router.navigate(['comandes', 'totes'], {
              queryParams: {
                text: order.name,
              },
            });
          },
          order: 2,
        },
        CANCEL: {
          visible: () => true,
          disabled: (order: LlecoopOrder) =>
            order.status === 'cancelled' ||
            order.status === 'waiting' ||
            order.status === 'done' ||
            (order.status !== 'progress' && order.orderCount > 0),
          description: (order: LlecoopOrder) => `Cancelar la comanda ${order.name}`,
          order: 3,
          icon: () => 'cancel',
          execute: (order: LlecoopOrder) => {
            this.#confirmService
              .confirm(
                'Cancel·lació de comanda',
                this.#sanitizer.bypassSecurityTrustHtml(
                  `<div class="flex flex-col gap-sm justify-center items-center rounded-xl p-md">
                    <p class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md text-center leading-6 text-balance">Segur que vols cancel·lar <nobr>la comanda "${order.name}" ?</nobr></p>
                    <p class="text-center">Un cop fet ja no es podrà tornar a activar.</p>
                  </div>
                `
                ),
                'Cancel·lar',
                'Cancel·lar comanda'
              )
              .pipe(take(1), filter(Boolean))
              .subscribe(() => this.#store.cancel(order));
          },
        },
        DELETE: {
          visible: () => true,
          disabled: order => order.status !== 'waiting' && order.status !== 'cancelled',
          description: (order: LlecoopOrder) => `Eliminar la comanda ${order.name}`,
          order: 4,
        },
      },
    } as TableDefinition<LlecoopOrder>;
  }
}
