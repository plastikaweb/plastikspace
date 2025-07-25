import { inject, Injectable, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { categoryNameCell } from '@plastik/llecoop/util';
import {
  DEFAULT_TABLE_CONFIG,
  TableColumnFormatting,
  TableDefinition,
  TableStructureConfig,
} from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderDetailFormTableConfig
  implements TableStructureConfig<LlecoopOrderProduct>
{
  readonly #sanitizer = inject(DomSanitizer);
  readonly #orderListStore = inject(llecoopOrderListStore);
  readonly #userOrderStore = inject(llecoopUserOrderStore);
  readonly #productBaseUnitTextPipe = inject(LlecoopProductBaseUnitTextPipe);
  readonly #productUnitSuffixPipe = inject(LlecoopProductUnitSuffixPipe);
  readonly #productUnitStepPipe = inject(LlecoopProductUnitStepPipe);

  readonly #name: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    pathToKey: 'name',
    sorting: 'normalizedName',
    sticky: true,
    cssClasses: ['min-w-[160px] @md:min-w-[250px] py-tiny', 'flex flex-col justify-start'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => {
        const name = `<p class="font-bold uppercase">${element?.['name']}</p>`;
        const info = element?.['info'] ? `<p class="font-bold">${element['info']}</p>` : '';
        return this.#sanitizer.bypassSecurityTrustHtml(`${name}${info}`) as SafeHtml;
      },
    },
  };

  readonly #provider: TableColumnFormatting<LlecoopOrderProduct, 'TEXT'> = {
    key: 'provider',
    title: 'Proveïdor',
    pathToKey: 'provider',
    sorting: 'provider',
    cssClasses: ['hidden @md:flex @md:min-w-[180px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #origin: TableColumnFormatting<LlecoopOrderProduct, 'TEXT'> = {
    key: 'origin',
    title: 'Procedència',
    pathToKey: 'origin',
    sorting: 'origin',
    cssClasses: ['hidden @md:flex @md:min-w-[180px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #priceWithIva: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'priceWithIva',
    title: 'Preu',
    pathToKey: 'priceWithIva',
    sorting: 'priceWithIva',
    cssClasses: ['min-w-[120px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        const price = `<p>${Number(value).toFixed(2)} €</p>`;
        const unit = element?.unit ? this.#productBaseUnitTextPipe.transform(element.unit) : '';

        return this.#sanitizer.bypassSecurityTrustHtml(`${price} ${unit}`) as SafeHtml;
      },
    },
  };

  readonly #initQuantity: TableColumnFormatting<LlecoopOrderProduct, 'INPUT'> = {
    key: 'initQuantity',
    title: 'Quantitat',
    pathToKey: 'initQuantity',
    sorting: 'initQuantity',
    cssClasses: ['w-[175px]', 'flex max-w-[175px]'],
    formatting: {
      type: 'INPUT',
    },
    isEditableConfig: orderProduct => ({
      type: 'number',
      attributes: {
        min: 0,
        step: this.#productUnitStepPipe.transform(orderProduct?.unit ?? { type: 'unit' }),
        suffix: this.#productUnitSuffixPipe.transform(orderProduct?.unit ?? { type: 'unit' }),
        styles: 'w-[110px]',
      },
      onChanges: (value, orderProduct) => {
        const quantity = Number(value);
        const price = (orderProduct?.priceWithIva || 0) * quantity;
        const newProduct = {
          ...orderProduct,
          initQuantity: quantity,
          initPrice: price,
          finalQuantity: quantity,
          finalPrice: price,
        };
        return newProduct;
      },
    }),
  };

  readonly #initPrice: TableColumnFormatting<LlecoopOrderProduct, 'CURRENCY'> = {
    key: 'initPrice',
    title: 'Preu total',
    pathToKey: 'initPrice',
    sorting: 'initPrice',
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'CURRENCY',
      extras: () => ({
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      }),
    },
  };

  readonly #columnProperties = signal([
    this.#name,
    categoryNameCell<LlecoopOrderProduct>({
      key: 'category',
      title: 'Categoria',
      pathToKey: 'category',
      cssClasses: ['hidden @lg:flex @lg:min-w-[170px] justify-start'],
    }),
    this.#provider,
    this.#origin,
    this.#priceWithIva,
    this.#initQuantity,
    this.#initPrice,
  ]);

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      sort: this.#userOrderStore.orderProductsSorting,
      pagination: this.#userOrderStore.orderProductsPagination,
      caption: 'Llistat de productes',
      count: this.#orderListStore.currentOrderCount,
      getData: () => this.#orderListStore.currentOrderAvailableProducts(),
      extraRowStyles: (orderProduct: LlecoopOrderProduct) => {
        return orderProduct.initPrice > 0 ? 'marked-ok' : '';
      },
      actions: {
        CLEAR_PRODUCT: {
          order: 1,
          type: 'input',
          visible: (orderProduct: LlecoopOrderProduct) => orderProduct.initPrice > 0,
          description: () => 'Treure producte',
          icon: () => 'cancel',
          execute: (orderProduct: LlecoopOrderProduct) =>
            this.#initQuantity?.isEditableConfig?.(orderProduct)?.onChanges?.(0, orderProduct),
        },
      },
    } as TableDefinition<LlecoopOrderProduct>;
  }
}
