import { inject, Injectable, signal, Signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  getLlecoopProductBasedUnitText,
  getLlecoopProductUnitStep,
  getLlecoopProductUnitSuffix,
  LlecoopOrderProduct,
} from '@plastik/llecoop/entities';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { productCategoryColumn } from '@plastik/llecoop/util';
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
export class LlecoopUserOrderDetailFormTableConfig
  implements TableStructureConfig<LlecoopOrderProduct>
{
  private readonly sanitizer = inject(DomSanitizer);
  private readonly store = inject(LLecoopOrderListStore);

  private readonly userProducts = signal([...this.store.currentOrderProducts()]);

  private readonly name: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[240px]', 'flex flex-col justify-start'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => {
        const name = `<p class="font-bold uppercase">${element?.['name']}</p>`;
        const info = element?.['info'] ? `<p class="font-bold">${element['info']}</p>` : '';
        return this.sanitizer.bypassSecurityTrustHtml(`${name}${info}`) as SafeHtml;
      },
    },
  };

  private readonly provider: TableColumnFormatting<LlecoopOrderProduct, 'TEXT'> = {
    key: 'provider',
    title: 'Proveïdor',
    propertyPath: 'provider',
    sorting: true,
    cssClasses: ['hidden md:flex md:min-w-[180px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly origin: TableColumnFormatting<LlecoopOrderProduct, 'TEXT'> = {
    key: 'origin',
    title: 'Procedència',
    propertyPath: 'origin',
    sorting: true,
    cssClasses: ['hidden md:flex md:min-w-[180px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly priceWithIva: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'priceWithIva',
    title: 'Preu',
    propertyPath: 'priceWithIva',
    sorting: true,
    cssClasses: ['min-w-[120px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        const price = `<p>${Number(value).toFixed(2)} €</p>`;
        const unit = element?.unit ? getLlecoopProductBasedUnitText(element.unit) : '';

        return this.sanitizer.bypassSecurityTrustHtml(`${price} ${unit}`) as SafeHtml;
      },
    },
  };

  private readonly initQuantity: TableColumnFormatting<LlecoopOrderProduct, 'INPUT'> = {
    key: 'initQuantity',
    title: 'Quantitat',
    propertyPath: 'initQuantity',
    sorting: true,
    cssClasses: ['min-w-[140px]', 'flex'],
    formatting: {
      type: 'INPUT',
      // extras: (orderProduct?: LlecoopOrderProduct) => ({
      //   type: 'number',
      //   placeholder: 'Quantitat',
      //   min: 0,
      //   step: getLlecoopProductUnitStep(orderProduct?.unit ?? { type: 'unit' }),
      //   suffix: getLlecoopProductUnitSuffix(orderProduct?.unit ?? { type: 'unit' }),
      // }),
      // onInputChanges: (value, orderProduct) => {
      //   return {
      //     initQuantity: Number(value),
      //     initPrice: (orderProduct?.priceWithIva || 0) * Number(value),
      //   };
      // },
    },
    isEditableConfig: orderProduct => ({
      type: 'number',
      attributes: {
        min: 0,
        step: getLlecoopProductUnitStep(orderProduct?.unit ?? { type: 'unit' }),
        suffix: getLlecoopProductUnitSuffix(orderProduct?.unit ?? { type: 'unit' }),
        placeholder: 'Quantitat',
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

  private readonly initPrice: TableColumnFormatting<LlecoopOrderProduct, 'CURRENCY'> = {
    key: 'initPrice',
    title: 'Preu total',
    propertyPath: 'initPrice',
    sorting: true,
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

  private readonly columnProperties: TableColumnFormatting<LlecoopOrderProduct, FormattingTypes>[] =
    [
      this.name,
      productCategoryColumn<LlecoopOrderProduct>(),
      this.provider,
      this.origin,
      this.priceWithIva,
      this.initQuantity,
      this.initPrice,
    ];

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return signal({
      ...defaultTableConfig,
      columnProperties: this.columnProperties,
      sort: this.store.sorting,
      caption: 'Llistat de productes',
      getData: () => this.userProducts(),
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
            this.initQuantity?.isEditableConfig?.(orderProduct)?.onChanges?.(0, orderProduct),
        },
      },
    }) as Signal<TableDefinition<LlecoopOrderProduct>>;
  }
}
