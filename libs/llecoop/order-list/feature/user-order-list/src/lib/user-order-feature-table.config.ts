import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { formatOrderStatus } from '@plastik/llecoop/order-list/util';
import { createdAt, updatedAt } from '@plastik/llecoop/util';
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
export class LlecoopUserOrderSearchFeatureTableConfig
  implements TableStructureConfig<LlecoopUserOrder>
{
  readonly #sanitizer = inject(DomSanitizer);
  readonly #userOrderStore = inject(LlecoopUserOrderStore);
  readonly #orderListStore = inject(LLecoopOrderListStore);

  readonly #name: TableColumnFormatting<LlecoopUserOrder, 'LINK'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[80px] @lg:min-w-[105px]'],
    link: (userOrder?: LlecoopUserOrder) => {
      return userOrder && this.checkIfOrderIsDone(userOrder)
        ? `./resum/${userOrder?.id}`
        : `./${userOrder?.id}`;
    },
    formatting: {
      type: 'LINK',
      execute: (_, userOrder) => `<p class="font-bold uppercase">${userOrder?.name}</p>`,
    },
  };

  readonly #price: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'totalPrice',
    title: 'Preu total',
    propertyPath: 'totalPrice',
    sorting: true,
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, userOrder) => {
        const price = userOrder?.totalPrice || 0;
        return this.#sanitizer.bypassSecurityTrustHtml(`${Number(price).toFixed(2)} €`) as SafeHtml;
      },
    },
  };

  readonly #productCount: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'cart',
    title: 'Nre. de productes',
    propertyPath: 'cart',
    sorting: true,
    cssClasses: ['hidden @lg:flex'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, userOrder) => userOrder?.cart.length || 0,
    },
  };

  readonly #status = formatOrderStatus<LlecoopUserOrder>();
  readonly #createdAt = createdAt<LlecoopUserOrder>();
  readonly #updatedAt = updatedAt<LlecoopUserOrder>();

  readonly #columnProperties: TableColumnFormatting<LlecoopUserOrder, FormattingTypes>[] = [
    this.#name,
    this.#price,
    this.#productCount,
    this.#status,
    this.#createdAt,
    this.#updatedAt,
  ];

  readonly #orderDoneStatusCache = new Map<string, boolean>();

  private checkIfOrderIsDone(order: LlecoopUserOrder): boolean {
    if (!order) return false;

    const cacheKey = `${order.orderListId}`;
    if (this.#orderDoneStatusCache.has(cacheKey)) {
      return this.#orderDoneStatusCache.get(cacheKey) as boolean;
    }

    const isDone = this.#orderListStore.entityMap()[order.orderListId]?.status === 'done';
    this.#orderDoneStatusCache.set(cacheKey, isDone);

    return isDone;
  }

  getTableDefinition(): TableDefinition<LlecoopUserOrder> {
    // Clear cache when getting new table definition
    this.#orderDoneStatusCache.clear();

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
      sort: this.#userOrderStore.sorting,
      count: this.#userOrderStore.count,
      caption: 'Llistat de les meves comandes',
      getData: () => this.#userOrderStore.entities(),
      actionsColStyles: 'max-w-[150px]',
      actions: {
        VIEW: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => !this.checkIfOrderIsDone(userOrder),
          description: () => 'Resum de la comanda',
          order: 1,
          icon: () => 'visibility',
          link: (userOrder: LlecoopUserOrder) => `resum/${userOrder?.id}`,
        },
        EDIT: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => this.checkIfOrderIsDone(userOrder),
          description: () => 'Edita la comanda',
          order: 2,
        },
        DELETE: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => this.checkIfOrderIsDone(userOrder),
          description: () => 'Elimina la comanda',
          order: 3,
        },
      },
    } as TableDefinition<LlecoopUserOrder>;
  }
}
