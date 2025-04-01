import { inject, Injectable, Signal, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  getLlecoopProductUnitStep,
  getLlecoopProductUnitSuffix,
  LlecoopOrderProduct,
} from '@plastik/llecoop/entities';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { categoryNameCell } from '@plastik/llecoop/util';
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
export class LlecoopOrderListFeatureDetailUserOrderDetailTableConfig
  implements TableStructureConfig<LlecoopOrderProduct>
{
  readonly #sanitizer = inject(DomSanitizer);
  readonly #store = inject(llecoopOrderListStore);
  readonly #currentOrderList = this.#store.currentOrderList();
  readonly #defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

  readonly #name: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    pathToKey: 'name',
    sorting: 'normalizedName',
    sticky: true,
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => {
        const name = `<p class="font-bold uppercase">${element?.['name']}</p>`;
        const info = element?.['info'] ? `<p class="font-bold">${element['info']}</p>` : '';
        return this.#sanitizer.bypassSecurityTrustHtml(`${name}${info}`) as SafeHtml;
      },
    },
  };

  readonly #initQuantity: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'initQuantity',
    title: 'Quantitat',
    pathToKey: 'initQuantity',
    sorting: 'initQuantity',
    cssClasses: ['min-w-[85px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, product) =>
        value
          ? `${Number(value).toFixed(2)} ${getLlecoopProductUnitSuffix(product?.unit ?? { type: 'unit' })}`
          : '-',
    },
  };

  readonly #initPrice: TableColumnFormatting<LlecoopOrderProduct, 'CURRENCY'> = {
    key: 'initPrice',
    title: 'Preu',
    pathToKey: 'initPrice',
    sorting: 'initPrice',
    cssClasses: ['min-w-[85px]'],
    formatting: {
      type: 'CURRENCY',
      extras: () => ({
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      }),
    },
  };

  readonly #finalQuantity: TableColumnFormatting<LlecoopOrderProduct, 'INPUT'> = {
    key: 'finalQuantity',
    title: 'Quantitat final',
    pathToKey: 'finalQuantity',
    sorting: 'finalQuantity',
    cssClasses: ['min-w-[140px] pe-md', 'min-w-[100px]'],
    formatting: {
      type: 'INPUT',
    },
    isEditableConfig: orderProduct => ({
      type: 'number',
      attributes: {
        min: 0,
        step: getLlecoopProductUnitStep(orderProduct?.unit ?? { type: 'unit' }),
        suffix: getLlecoopProductUnitSuffix(orderProduct?.unit ?? { type: 'unit' }),
        placeholder: 'Quantitat final',
      },
      onChanges: (value, orderProduct) => {
        const quantity = Number(value);
        const price = (orderProduct?.priceWithIva || 0) * quantity;
        const newProduct = {
          ...orderProduct,
          finalQuantity: quantity,
          finalPrice: price,
        };
        return newProduct;
      },
    }),
  };

  readonly #finalPrice: TableColumnFormatting<LlecoopOrderProduct, 'CURRENCY'> = {
    key: 'finalPrice',
    title: 'Preu final',
    pathToKey: 'finalPrice',
    sorting: 'finalPrice',
    cssClasses: ['min-w-[90px]'],
    formatting: {
      type: 'CURRENCY',
      extras: () => ({
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      }),
    },
  };

  readonly #extraInfo: TableColumnFormatting<LlecoopOrderProduct, 'INPUT'> = {
    key: 'extraInfo',
    title: 'Comentaris de El Llevat',
    pathToKey: 'extraInfo',
    sorting: 'extraInfo',
    cssClasses: ['min-w-[250px] px-sm'],
    formatting: {
      type: 'INPUT',
    },
    isEditableConfig: () => ({
      type: 'textarea',
      attributes: {
        placeholder: 'Comentaris',
      },
      onChanges: (value, orderProduct) => {
        return {
          ...orderProduct,
          extraInfo: (value as string).trim() || '',
        };
      },
    }),
  };

  readonly #reviewed: TableColumnFormatting<LlecoopOrderProduct, 'INPUT'> = {
    key: 'reviewed',
    title: 'Revisat',
    pathToKey: 'reviewed',
    sorting: 'reviewed',
    cssClasses: ['min-w-[100px] px-sm'],
    formatting: {
      type: 'INPUT',
    },
    isEditableConfig: orderProduct => ({
      type: 'toggle',
      attributes: {
        placeholder: 'canvia estat de la revisió',
        checked: orderProduct?.reviewed,
      },
      onChanges: (value, orderProduct) => {
        const reviewed = Boolean(value);
        const newProduct = {
          ...orderProduct,
          reviewed,
        };
        return newProduct;
      },
    }),
  };

  readonly #columnProperties: Signal<
    TableColumnFormatting<LlecoopOrderProduct, FormattingTypes>[]
  > = signal([
    this.#name,
    categoryNameCell<LlecoopOrderProduct>({
      key: 'category',
      title: 'Categoria',
      pathToKey: 'category',
      cssClasses: ['hidden @lg:flex @lg:min-w-[170px] justify-start'],
    }),
    this.#initQuantity,
    this.#initPrice,
    ...(this.#currentOrderList?.status !== 'progress' ? [this.#finalQuantity] : []),
    ...(this.#currentOrderList?.status !== 'progress' ? [this.#finalPrice] : []),
    ...(this.#currentOrderList?.status !== 'progress' ? [this.#extraInfo] : []),
    ...(this.#currentOrderList?.status !== 'progress' ? [this.#reviewed] : []),
    // this.#finalQuantity,
    // this.#finalPrice,
    // this.#extraInfo,
    // this.#reviewed,
  ]);

  getTableDefinition() {
    return {
      ...this.#defaultTableConfig,
      columnProperties: this.#columnProperties,
      sort: this.#store.sorting,
      caption: 'Comanda de soci: Llistat de productes',
      noPagination: true,
      extraRowStyles: (orderProduct: LlecoopOrderProduct) => {
        return orderProduct.finalQuantity !== orderProduct.initQuantity ||
          (orderProduct.extraInfo ?? '').trim().length > 0
          ? 'marked-changed'
          : orderProduct.reviewed
            ? 'marked-ok'
            : '';
      },
    } as TableDefinition<LlecoopOrderProduct>;
  }
}
