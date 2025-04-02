import { inject, Injectable, Signal, signal } from '@angular/core';
import { getLlecoopProductUnitSuffix, LlecoopOrderProductTotal } from '@plastik/llecoop/entities';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
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
export class LlecoopOrderListFeatureListTotalDetailTableConfig
  implements TableStructureConfig<LlecoopOrderProductTotal>
{
  readonly #store = inject(llecoopOrderListStore);
  readonly #defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

  readonly #name: TableColumnFormatting<LlecoopOrderProductTotal, 'TITLE_CASE'> = {
    key: 'name',
    title: 'Nom',
    pathToKey: 'name',
    sorting: 'normalizedName',
    sticky: true,
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'TITLE_CASE',
    },
  };

  readonly #quantity: TableColumnFormatting<LlecoopOrderProductTotal, 'CUSTOM'> = {
    key: 'quantity',
    title: 'Quantitat',
    pathToKey: 'quantity',
    sorting: 'quantity',
    cssClasses: ['min-w-[110px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, product) =>
        value
          ? `${Number(value).toFixed(2)} ${getLlecoopProductUnitSuffix(product?.unit ?? { type: 'unit' })}`
          : '-',
    },
  };

  readonly #price: TableColumnFormatting<LlecoopOrderProductTotal, 'CURRENCY'> = {
    key: 'price',
    title: 'Preu individual',
    pathToKey: 'price',
    sorting: 'price',
    cssClasses: ['hidden @xl:flex @xl:min-w-[125px]'],
    formatting: {
      type: 'CURRENCY',
      extras: () => ({
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      }),
    },
  };

  readonly #iva: TableColumnFormatting<LlecoopOrderProductTotal, 'PERCENTAGE'> = {
    key: 'iva',
    title: 'IVA',
    pathToKey: 'iva',
    cssClasses: ['hidden @xl:flex @xl:min-w-[60px]'],
    formatting: {
      type: 'PERCENTAGE',
    },
  };

  readonly #totalPrice: TableColumnFormatting<LlecoopOrderProductTotal, 'CURRENCY'> = {
    key: 'totalPrice',
    title: 'Preu amb IVA',
    pathToKey: 'totalPrice',
    sorting: 'totalPrice',
    cssClasses: ['hidden @lg:flex @lg:min-w-[105px]'],
    formatting: {
      type: 'CURRENCY',
      extras: () => ({
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      }),
    },
  };

  readonly #reviewed: TableColumnFormatting<LlecoopOrderProductTotal, 'CUSTOM'> = {
    key: 'reviewed',
    title: 'Revisat',
    pathToKey: 'reviewed',
    cssClasses: ['hidden @md:flex @md:min-w-[110px]'],
    sorting: 'reviewed',
    formatting: {
      type: 'CUSTOM',
      execute: (_, product) => (product?.reviewed ? '✔' : '✘'),
    },
  };

  readonly #columnProperties: Signal<
    TableColumnFormatting<LlecoopOrderProductTotal, FormattingTypes>[]
  > = signal([
    this.#name,
    this.#price,
    this.#quantity,
    this.#iva,
    this.#totalPrice,
    this.#reviewed,
  ]);

  getTableDefinition() {
    return {
      ...this.#defaultTableConfig,
      columnProperties: this.#columnProperties,
      getData: (id: string) => this.#store.getItemById(id).total,
      sort: this.#store.sorting,
      caption: `Comanda ${this.#store.selectedItem()?.name}: Detall de totals`,
      noPagination: true,
    } as TableDefinition<LlecoopOrderProductTotal>;
  }
}
