import { computed, inject, Injectable, Signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { formatOrderStatus, formatUserOrderDeliveryDate } from '@plastik/llecoop/order-list/util';
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
export class LlecoopOrderListFeatureDetailTableConfig
  implements TableStructureConfig<LlecoopUserOrder>
{
  readonly #sanitizer = inject(DomSanitizer);
  readonly #orderListStore = inject(llecoopOrderListStore);
  readonly #userOrderStore = inject(llecoopUserOrderStore);

  readonly #userName: TableColumnFormatting<LlecoopUserOrder, 'TITLE_CASE'> = {
    key: 'userName',
    title: 'Sòcia/unitat familiar',
    pathToKey: 'userName',
    sorting: 'userName',
    cssClasses: ['min-w-[120px]'],
    formatting: {
      type: 'TITLE_CASE',
    },
  };
  readonly #deliveryType: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'deliveryType',
    title: 'Tipus de lliurament',
    pathToKey: 'deliveryType',
    sorting: 'deliveryType',
    cssClasses: ['min-w-[110px] @2xl:min-w-[125px]'],
    formatting: {
      type: 'CUSTOM',
      execute: value => {
        const deliveryType = value as LlecoopUserOrder['deliveryType'];
        return deliveryType === 'pickup' ? 'Retirar' : 'Entrega';
      },
    },
  };

  readonly #address: TableColumnFormatting<LlecoopUserOrder, 'TEXT'> = {
    key: 'address',
    title: 'Adreça de lliurament',
    pathToKey: 'address',
    sorting: 'address',
    cssClasses: ['hidden @4xl:flex @4xl:min-w-[100px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #deliveryDateAndTime: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'deliveryDateAndTime',
    title: 'Data i hora de lliurament',
    pathToKey: 'deliveryDateAndTime',
    sorting: 'deliveryDateAndTime',
    cssClasses: ['min-w-[125px] @2xl:min-w-[150px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) =>
        (element && formatUserOrderDeliveryDate(element, this.#sanitizer)) ?? '-',
    },
  };

  readonly #totalPrice: TableColumnFormatting<LlecoopUserOrder, 'CURRENCY'> = {
    key: 'totalPrice',
    title: 'Preu',
    pathToKey: 'totalPrice',
    sorting: 'totalPrice',
    cssClasses: ['min-w-[80px] 2xl:min-w-[100px]'],
    formatting: {
      type: 'CURRENCY',
      extras: () => ({
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      }),
    },
  };

  readonly #totalProducts: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'cart',
    title: 'Nre. de productes',
    pathToKey: 'cart',
    sorting: 'cart',
    cssClasses: ['hidden @2xl:flex @2xl:min-w-[80px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => element?.cart.length ?? 0,
    },
  };

  readonly #status = formatOrderStatus<LlecoopUserOrder>();

  readonly #columnProperties: TableColumnFormatting<LlecoopUserOrder, FormattingTypes>[] = [
    this.#userName,
    this.#status,
    this.#deliveryType,
    this.#deliveryDateAndTime,
    this.#address,
    this.#totalPrice,
    this.#totalProducts,
  ];

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      caption: 'Llistat de comandes',
      sort: this.#orderListStore.selectedItemUserSorting,
      pagination: this.#orderListStore.selectedItemUserPagination,
      filter: this.#orderListStore.selectedItemUserFilter,
      getData: () => {
        return this.#orderListStore.selectedItem()?.orders || [];
      },
      count: computed(() => this.#orderListStore.selectedItem()?.orderCount || 0) as Signal<number>,
      getSelectedItemId: computed(() => this.#orderListStore.selectedItemUserOrderId()) as Signal<
        string | null
      >,
      actions: {
        SET_DELIVERED: {
          visible: () => true,
          disabled: (order: LlecoopUserOrder) => order.status !== 'reviewed',
          description: () => 'Marcar com a entregada',
          order: 1,
          icon: () => 'local_shipping',
          execute: (order: LlecoopUserOrder) => {
            this.#userOrderStore.update({
              item: { ...order, status: 'delivered' },
              redirectUrl: `./admin/comanda/${order.orderListId}`,
            });
          },
        },
      },
    } as TableDefinition<LlecoopUserOrder>;
  }
}
