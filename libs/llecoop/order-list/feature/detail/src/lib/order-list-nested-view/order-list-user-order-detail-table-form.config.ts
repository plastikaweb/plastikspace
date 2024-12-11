import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
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
export class LlecoopOrderListUserOrderDetailFormTableConfig
  implements TableStructureConfig<LlecoopOrderProduct>
{
  private readonly sanitizer = inject(DomSanitizer);
  private readonly store = inject(LLecoopOrderListStore);
  private readonly defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

  private readonly name: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[200px]', 'flex flex-col justify-start'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => {
        const name = `<p class="font-bold uppercase">${element?.['name']}</p>`;
        const info = element?.['info'] ? `<p class="font-bold">${element['info']}</p>` : '';
        return this.sanitizer.bypassSecurityTrustHtml(`${name}${info}`) as SafeHtml;
      },
    },
  };

  private readonly initQuantity: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'initQuantity',
    title: 'Quantitat inicial',
    propertyPath: 'initQuantity',
    sorting: true,
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, orderProduct) => {
        return value
          ? `${value} ${getLlecoopProductUnitSuffix(orderProduct?.unit ?? { type: 'unit' })}`
          : '-';
      },
    },
  };

  private readonly initPrice: TableColumnFormatting<LlecoopOrderProduct, 'CURRENCY'> = {
    key: 'initPrice',
    title: 'Preu inicial',
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

  private readonly finalQuantity: TableColumnFormatting<LlecoopOrderProduct, 'INPUT'> = {
    key: 'finalQuantity',
    title: 'Quantitat final',
    propertyPath: 'finalQuantity',
    sorting: true,
    cssClasses: ['min-w-[100px] pe-md'],
    formatting: {
      type: 'INPUT',
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
          finalQuantity: quantity,
          finalPrice: price,
        };
        return newProduct;
      },
    }),
  };

  private readonly finalPrice: TableColumnFormatting<LlecoopOrderProduct, 'CURRENCY'> = {
    key: 'finalPrice',
    title: 'Preu final',
    propertyPath: 'finalPrice',
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

  private readonly extraInfo: TableColumnFormatting<LlecoopOrderProduct, 'INPUT'> = {
    key: 'extraInfo',
    title: 'Comentaris',
    propertyPath: 'extraInfo',
    sorting: true,
    cssClasses: ['min-w-[250px] px-sm'],
    formatting: {
      type: 'INPUT',
    },
    isEditableConfig: () => ({
      type: 'textarea',
      attributes: {
        rows: 3,
      },
      onChanges: (value, orderProduct) => {
        return {
          ...orderProduct,
          extraInfo: (value as string).trim() || '',
        };
      },
    }),
  };

  private readonly reviewed: TableColumnFormatting<LlecoopOrderProduct, 'INPUT'> = {
    key: 'reviewed',
    title: 'Revisat',
    propertyPath: 'reviewed',
    sorting: true,
    cssClasses: ['min-w-[100px] px-sm'],
    formatting: {
      type: 'INPUT',
    },
    isEditableConfig: orderProduct => ({
      type: 'toggle',
      attributes: {
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

  private readonly columnProperties: TableColumnFormatting<LlecoopOrderProduct, FormattingTypes>[] =
    [
      this.name,
      productCategoryColumn<LlecoopOrderProduct>({
        cssClasses: ['hidden lg:flex lg:min-w-[170px] justify-start'],
      }),
      this.initQuantity,
      this.initPrice,
      this.finalQuantity,
      this.finalPrice,
      this.extraInfo,
      this.reviewed,
    ];

  getTableDefinition() {
    return {
      ...this.defaultTableConfig,
      columnProperties: this.columnProperties,
      sort: this.store.sorting,
      caption: 'Comanda de soci: Llistat de productes',
      noPagination: true,
      extraRowStyles: (orderProduct: LlecoopOrderProduct) => {
        return orderProduct.reviewed
          ? 'marked-ok'
          : orderProduct.finalQuantity !== orderProduct.initQuantity ||
              (orderProduct.extraInfo ?? '').trim().length > 0
            ? 'marked-changed'
            : '';
      },
    } as TableDefinition<LlecoopOrderProduct>;
  }
}
