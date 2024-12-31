import { filter, take } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrder } from '@plastik/llecoop/entities';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { formatOrderListStatus } from '@plastik/llecoop/order-list/util';
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
  readonly #store = inject(LLecoopOrderListStore);
  readonly #sanitizer = inject(DomSanitizer);
  readonly #confirmService = inject(SharedConfirmDialogService);

  readonly #name: TableColumnFormatting<LlecoopOrder, 'TEXT'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['max-w-[120px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #status: TableColumnFormatting<LlecoopOrder, 'CUSTOM'> = {
    key: 'status',
    title: 'Estat',
    propertyPath: 'status',
    sorting: true,
    cssClasses: ['max-w-[60px] md:min-w-[140px] md:max-w-[180px]'],
    formatting: {
      type: 'CUSTOM',
      execute: status => formatOrderListStatus(this.#sanitizer, status as LlecoopOrder['status']),
    },
  };

  readonly #endTime = createFirebaseTimestampTableColumn<LlecoopOrder>(
    {
      key: 'endTime',
      title: 'Data de tancament',
      propertyPath: 'endTime',
      cssClasses: ['max-w-[290px]'],
    },
    'dd/MM/yyyy HH:mm'
  );

  readonly #orderCount: TableColumnFormatting<LlecoopOrder, 'TEXT'> = {
    key: 'orderCount',
    title: 'Comandes realitzades',
    propertyPath: 'orderCount',
    sorting: true,
    cssClasses: ['hidden md:flex max-w-[160px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #availableProducts: TableColumnFormatting<LlecoopOrder, 'CUSTOM'> = {
    key: 'availableProducts',
    title: 'Productes inclosos',
    propertyPath: 'availableProducts',
    sorting: true,
    cssClasses: ['hidden lg:flex max-w-[160px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, item) => item?.availableProducts.length || 0,
    },
  };

  readonly #createdAt = createdAt<LlecoopOrder>();

  readonly #columnProperties: TableColumnFormatting<LlecoopOrder, FormattingTypes>[] = [
    this.#name,
    this.#status,
    this.#endTime,
    this.#availableProducts,
    this.#orderCount,
    this.#createdAt,
  ];

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      paginationVisibility: {
        hidePageSize: true,
        hideRangeLabel: true,
        hideRangeButtons: true,
        hidePaginationFirstLastButtons: true,
      },
      sort: this.#store.sorting,
      caption: 'Llistat de comandes setmanals',
      count: this.#store.count,
      getData: () => this.#store.entities(),
      actionsColStyles: 'min-w-[250px]',
      actions: {
        SET_STATUS: {
          visible: () => true,
          disabled: order => order.status !== 'waiting' && order.status !== 'progress',
          description: order =>
            order.status === 'waiting' ? 'Activa la comanda' : 'Fica la comanda en pausa',
          order: 1,
          icon: order => (order.status === 'waiting' ? 'play_circle' : 'pause_circle'),
          execute: (order: LlecoopOrder) => {
            this.#confirmService
              .confirm(
                order.status === 'waiting' ? 'Activació de comanda' : 'Desactivació de comanda',
                order.status === 'waiting'
                  ? this.#sanitizer.bypassSecurityTrustHtml(
                      `<div class="flex flex-col gap-sm justify-center items-center bg-secondary-light rounded-xl p-md">
                    <h5 class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md text-center">Segur que vols activar la comanda "${order.name}"?</h5>
                    <p class="text-secondary-dark text-center md:text-left">Un cop activada es podrà tornar a pausar fins la data de tancament.</p>
                  </div>
                `
                    )
                  : this.#sanitizer.bypassSecurityTrustHtml(
                      `<div class="flex flex-col gap-sm justify-center items-center bg-secondary-light rounded-xl p-md">
                    <h5 class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md text-center">Segur que vols ficar en pausa la comanda "${order.name}"?</h5>
                    <p class="text-secondary-dark text-center md:text-left">La podràs tornar a activar en qualsevol moment fins la data de tancament.</p>
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
        CANCEL: {
          visible: () => true,
          disabled: (order: LlecoopOrder) =>
            order.status === 'cancel' ||
            order.status === 'waiting' ||
            order.status === 'done' ||
            (order.status !== 'progress' && order.orderCount > 0),
          description: () => 'Cancel·la la comanda',
          order: 4,
          icon: () => 'cancel',
          execute: (order: LlecoopOrder) => {
            this.#confirmService
              .confirm(
                'Cancel·lació de comanda',
                this.#sanitizer.bypassSecurityTrustHtml(
                  `<div class="flex flex-col gap-sm justify-center items-center bg-secondary-light rounded-xl p-md">
                    <h5 class="bg-secondary-dark text-white font-bold py-sub px-sm rounded-md text-center">Segur que vols cancel·lar la comanda "${order.name}"?</h5>
                    <p class="text-secondary-dark text-center md:text-left">Un cop cancel·lada ja no es pot tornar a activar.</p>
                  </div>
                `
                ),
                'Cancel·lar',
                'Acceptar'
              )
              .pipe(take(1), filter(Boolean))
              .subscribe(() => this.#store.cancel(order));
          },
        },
        VIEW: {
          visible: () => true,
          disabled: (order: LlecoopOrder) => order.status === 'waiting',
          description: () => 'Mostra les comandes realitzades',
          order: 2,
          icon: () => 'visibility',
          link: (order: LlecoopOrder) => `${order.id}`,
        },
        DELETE: {
          visible: () => true,
          disabled: (order: LlecoopOrder) =>
            order.status !== 'waiting' && order.status !== 'cancel',
          description: () => 'Elimina la comanda',
          order: 3,
        },
      },
    } as TableDefinition<LlecoopOrder>;
  }
}
