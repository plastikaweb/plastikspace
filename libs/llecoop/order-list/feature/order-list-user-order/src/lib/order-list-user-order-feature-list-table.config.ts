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
export class LlecoopOrderListUserOrderFeatureListTableConfig
  implements TableStructureConfig<LlecoopUserOrder>
{
  readonly #sanitizer = inject(DomSanitizer);
  readonly #userOrderStore = inject(llecoopUserOrderStore);
  readonly #orderListStore = inject(llecoopOrderListStore);
  readonly #userOrderUtilsService = inject(UserOrderUtilsService);

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

  readonly #name: TableColumnFormatting<LlecoopUserOrder, 'LINK'> = {
    key: 'name',
    title: 'Comanda setmanal',
    pathToKey: 'name',
    sorting: 'normalizedName',
    cssClasses: ['min-w-[80px] @lg:min-w-[105px]'],
    link: () => ['/comandes', 'setmanals'],
    queryParams: (order?: LlecoopUserOrder) => ({
      text: order?.name || '',
    }),
    formatting: {
      type: 'LINK',
      execute: (_, order) => order?.name || '-',
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
      this.#userName,
      this.#name,
      this.#price,
      this.#productCount,
      this.#status,
      this.#createdAt,
      this.#updatedAt,
    ]);

  readonly #orderDoneStatusCache: Map<string, { allowBlock: boolean; allowView: boolean }> =
    new Map();

  private checkOrderStatus(order: LlecoopUserOrder): { allowBlock: boolean; allowView: boolean } {
    if (!order) return { allowBlock: false, allowView: false };

    const cacheKey = `${order.id}`;
    if (this.#orderDoneStatusCache.has(cacheKey)) {
      return this.#orderDoneStatusCache.get(cacheKey) as {
        allowBlock: boolean;
        allowView: boolean;
      };
    }

    const orderListStatus = this.#orderListStore?.entityMap()?.[order.orderListId]?.status;
    const userOrderStatus = order.status;
    const allowBlock =
      (orderListStatus === 'waiting' || orderListStatus === 'progress') &&
      (userOrderStatus === 'waitingReview' || userOrderStatus === 'reviewed');
    const allowView = userOrderStatus !== 'waitingReview';
    this.#orderDoneStatusCache.set(cacheKey, { allowBlock, allowView });

    return { allowBlock, allowView };
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
      getData: () => this.#userOrderStore.entities(),
      count: this.#userOrderStore.count,
      extraRowStyles: (userOrder: LlecoopUserOrder) => {
        return userOrder.status === 'blocked'
          ? 'marked-ko'
          : userOrder.status === 'delivered'
            ? 'marked-ok'
            : '';
      },
      actionsColStyles: 'max-w-[150px]',
      actions: {
        SET_DELIVERED: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => userOrder.status !== 'reviewed',
          description: (userOrder: LlecoopUserOrder) =>
            `Marcar la comanda ${userOrder.id} de ${userOrder.userName} corresponent a ${userOrder.name} com entregada`,
          order: 2,
          icon: () => 'local_shipping',
          execute: (userOrder: LlecoopUserOrder) => {
            this.#userOrderStore.update({
              item: {
                ...userOrder,
                status: 'delivered',
              },
              redirectUrl: `./comandes/totes`,
            });
          },
        },
        VIEW: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => !this.checkOrderStatus(userOrder).allowView,
          description: (userOrder: LlecoopUserOrder) =>
            `Mostrar resum de la comanda ${userOrder.id} de ${userOrder.userName} corresponent a ${userOrder.name}`,
          order: 3,
          icon: () => 'receipt',
          link: (userOrder: LlecoopUserOrder) => ['../../comandes', userOrder?.id, 'resum'],
        },
        BLOCK: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => !this.checkOrderStatus(userOrder).allowBlock,
          description: (userOrder: LlecoopUserOrder) =>
            userOrder.status === 'blocked'
              ? `Desbloquejar la comanda ${userOrder.id} de ${userOrder.userName} corresponent a ${userOrder.name}`
              : `Bloquejar la comanda ${userOrder.id} de ${userOrder.userName} corresponent a ${userOrder.name}`,
          order: 1,
          icon: (userOrder: LlecoopUserOrder) =>
            userOrder.status === 'blocked' ? 'enhanced_encryption' : 'no_encryption',
          execute: (userOrder: LlecoopUserOrder) => {
            this.#userOrderStore.update({
              item: {
                ...userOrder,
                status: userOrder.status === 'blocked' ? 'waitingReview' : 'blocked',
              },
              redirectUrl: `./comandes/totes`,
            });
          },
        },
      },
    } as TableDefinition<LlecoopUserOrder>;
  }
}
