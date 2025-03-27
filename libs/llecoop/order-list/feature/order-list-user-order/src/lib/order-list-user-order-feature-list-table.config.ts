import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
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
export class LlecoopOrderListUserOrderFeatureListTableConfig
  implements TableStructureConfig<LlecoopUserOrder>
{
  readonly #sanitizer = inject(DomSanitizer);
  readonly #userOrderStore = inject(llecoopUserOrderStore);
  readonly #orderListStore = inject(llecoopOrderListStore);

  readonly #name: TableColumnFormatting<LlecoopUserOrder, 'LINK'> = {
    key: 'name',
    title: 'Comanda setmanal',
    pathToKey: 'name',
    sorting: 'normalizedName',
    sticky: true,
    cssClasses: ['min-w-[80px] @lg:min-w-[105px]'],
    link: (userOrder?: LlecoopUserOrder) => {
      return userOrder && this.checkIfOrderIsDone(userOrder)
        ? `./${userOrder?.id}/resum`
        : `./${userOrder?.id}`;
    },
    formatting: {
      type: 'LINK',
      execute: (_, userOrder) => `<p class="font-bold uppercase">${userOrder?.name}</p>`,
    },
  };

  readonly #userName: TableColumnFormatting<LlecoopUserOrder, 'TEXT'> = {
    key: 'userName',
    title: 'Nom sòcia',
    pathToKey: 'userName',
    sorting: 'userName',
    sticky: true,
    cssClasses: ['min-w-[80px] @lg:min-w-[105px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #price: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'totalPrice',
    title: 'Preu total',
    pathToKey: 'totalPrice',
    sorting: 'totalPrice',
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
    pathToKey: 'cart',
    sorting: 'cart',
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
    this.#userName,
    this.#price,
    this.#productCount,
    this.#status,
    this.#createdAt,
    this.#updatedAt,
  ];

  readonly #orderDoneStatusCache: Map<string, boolean> = new Map();

  private checkIfOrderIsDone(order: LlecoopUserOrder): boolean {
    if (!order) return false;

    const cacheKey = `${order.orderListId}`;
    if (this.#orderDoneStatusCache.has(cacheKey)) {
      return this.#orderDoneStatusCache.get(cacheKey) as boolean;
    }

    const status = this.#orderListStore?.entityMap()?.[order.orderListId]?.status;
    const isDone = status === 'done' || status === 'cancelled';
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
      sort: this.#userOrderStore.sorting,
      pagination: this.#userOrderStore.pagination,
      caption: 'Llistat de les meves comandes',
      count: this.#userOrderStore.count,
      getData: () => this.#userOrderStore.entities(),
      actionsColStyles: 'max-w-[150px]',
      actions: {
        VIEW: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => !this.checkIfOrderIsDone(userOrder),
          description: () => 'Resum de la comanda',
          order: 1,
          icon: () => 'visibility',
          link: (userOrder: LlecoopUserOrder) => `${userOrder?.id}/resum`,
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
