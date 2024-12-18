import { computed, inject, Injectable, Signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import {
  formatUserOrderDeliveryDate,
  formatUserOrderStatus,
} from '@plastik/llecoop/order-list/util';
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
export class LlecoopOrderListOrderDetailSearchFeatureTableConfig
  implements TableStructureConfig<LlecoopUserOrder>
{
  readonly #sanitizer = inject(DomSanitizer);
  readonly #store = inject(LLecoopOrderListStore);

  readonly #userName: TableColumnFormatting<LlecoopUserOrder, 'TITLE_CASE'> = {
    key: 'userName',
    title: 'Sòcia/unitat familiar',
    propertyPath: 'userName',
    sorting: true,
    cssClasses: ['max-w-[170px]  md:max-w-[250px]'],
    formatting: {
      type: 'TITLE_CASE',
    },
  };
  readonly #deliveryType: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'deliveryType',
    title: 'Tipus de lliurament',
    propertyPath: 'deliveryType',
    sorting: true,
    cssClasses: ['max-w-[150px] md:max-w-[250px]'],
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
    sorting: true,
    cssClasses: ['min-w-[120px] md:min-w-[250px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #deliveryDateAndTime: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'deliveryDateAndTime',
    title: 'Data i hora de lliurament',
    propertyPath: 'deliveryDateAndTime',
    sorting: true,
    cssClasses: ['min-w-[120px] md:min-w-[250px]'],
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
    cssClasses: ['max-w-[100px] md:max-w-[130px]'],
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
    cssClasses: ['max-w-[130px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => element?.cart.length ?? 0,
    },
  };

  readonly #status: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'status',
    title: 'Estat',
    propertyPath: 'status',
    sorting: true,
    cssClasses: ['max-w-[70px] md:max-w-[150px]'],
    formatting: {
      type: 'CUSTOM',
      execute: status =>
        formatUserOrderStatus(this.#sanitizer, status as LlecoopUserOrder['status']),
    },
  };

  readonly #columnProperties: TableColumnFormatting<LlecoopUserOrder, FormattingTypes>[] = [
    this.#userName,
    this.#status,
    this.#deliveryType,
    this.#address,
    this.#deliveryDateAndTime,
    this.#totalPrice,
    this.#totalProducts,
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
      caption: 'Llistat de comandes',
      sort: this.#store.sorting,
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
