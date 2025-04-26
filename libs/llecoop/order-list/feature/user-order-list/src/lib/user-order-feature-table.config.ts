import { inject, Injectable, Signal, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { UserOrderUtilsService } from '@plastik/llecoop/order-list/util';
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
  readonly #userOrderStore = inject(llecoopUserOrderStore);
  readonly #orderListStore = inject(llecoopOrderListStore);
  readonly #userOrderUtilsService = inject(UserOrderUtilsService);

  readonly #name: TableColumnFormatting<LlecoopUserOrder, 'LINK'> = {
    key: 'name',
    title: 'Nom',
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

  readonly #status = this.#userOrderUtilsService.formatOrderStatus<LlecoopUserOrder>();
  readonly #createdAt = createdAt<LlecoopUserOrder>();
  readonly #updatedAt = updatedAt<LlecoopUserOrder>();

  readonly #columnProperties: Signal<TableColumnFormatting<LlecoopUserOrder, FormattingTypes>[]> =
    signal([
      this.#name,
      this.#price,
      this.#productCount,
      this.#status,
      this.#createdAt,
      this.#updatedAt,
    ]);

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
          description: (userOrder: LlecoopUserOrder) => `Veure resum de la comanda ${userOrder.id}`,
          order: 1,
          icon: () => 'visibility',
          link: (userOrder: LlecoopUserOrder) => `${userOrder?.id}/resum`,
        },
        EDIT: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => this.checkIfOrderIsDone(userOrder),
          description: (userOrder: LlecoopUserOrder) => `Editar la comanda ${userOrder.id}`,
          order: 2,
        },
        DELETE: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => this.checkIfOrderIsDone(userOrder),
          description: (userOrder: LlecoopUserOrder) => `Eliminar la comanda ${userOrder.id}`,
          order: 3,
        },
      },
    } as TableDefinition<LlecoopUserOrder>;
  }
}
