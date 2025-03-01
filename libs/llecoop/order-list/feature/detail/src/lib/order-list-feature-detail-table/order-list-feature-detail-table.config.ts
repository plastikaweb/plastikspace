import { computed, inject, Injectable, Signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
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
  readonly #store = inject(llecoopOrderListStore);

  readonly #userName: TableColumnFormatting<LlecoopUserOrder, 'TITLE_CASE'> = {
    key: 'userName',
    title: 'Sòcia/unitat familiar',
    propertyPath: 'userName',
    sorting: true,
    cssClasses: ['min-w-[120px]'],
    formatting: {
      type: 'TITLE_CASE',
    },
  };
  readonly #deliveryType: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'deliveryType',
    title: 'Tipus de lliurament',
    propertyPath: 'deliveryType',
    sorting: true,
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
    propertyPath: 'address',
    cssClasses: ['hidden @4xl:flex @4xl:min-w-[100px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #deliveryDateAndTime: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'deliveryDateAndTime',
    title: 'Data i hora de lliurament',
    propertyPath: 'deliveryDateAndTime',
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
    propertyPath: 'totalPrice',
    sorting: true,
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
    propertyPath: 'cart',
    sorting: true,
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
      sort: this.#store.selectedItemUserSorting,
      pagination: this.#store.selectedItemUserPagination,
      count: computed(() => this.#store.selectedItem()?.orderCount || 0) as Signal<number>,
      getData: () => {
        return this.#store.selectedItem()?.orders || [];
      },
      getSelectedItemId: computed(() => this.#store.selectedItemUserOrderId()) as Signal<
        string | null
      >,
    } as TableDefinition<LlecoopUserOrder>;
  }
}
