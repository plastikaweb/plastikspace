import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  getLlecoopProductBasedUnitText,
  getLlecoopProductUnitStep,
  getLlecoopProductUnitSuffix,
  LlecoopOrderProduct,
} from '@plastik/llecoop/entities';
import { productCategoryColumn } from '@plastik/llecoop/util';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  DEFAULT_TABLE_CONFIG,
  TableColumnFormatting,
  TableControlStructure,
  TableStructureConfig,
} from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderDetailFormTableConfig
  implements TableStructureConfig<LlecoopOrderProduct>
{
  private readonly sanitizer = inject(DomSanitizer);

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
      extras: (value?: LlecoopOrderProduct) => ({
        type: 'number',
        placeholder: 'Quantitat',
        min: 0,
        step: getLlecoopProductUnitStep(value?.unit ?? { type: 'unit' }),
        suffix: getLlecoopProductUnitSuffix(value?.unit ?? { type: 'unit' }),
      }),
      onInputChanges: (value, element) => {
        return {
          initQuantity: Number(value),
          initPrice: (element?.priceWithIva || 0) * Number(value),
        };
      },
    },
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

  getTableStructure(): WritableSignal<TableControlStructure<LlecoopOrderProduct>> {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return signal({
      ...defaultTableConfig,
      columnProperties: this.columnProperties,
      sort: ['name', 'asc'],
      caption: 'Llistat de productes',
      extraRowStyles: element => {
        return element.initPrice > 0 ? 'marked-ok' : '';
      },
      actions: {
        CLEAR_PRODUCT: {
          visible: (product: LlecoopOrderProduct) => product.initPrice > 0,
          description: () => 'Treure producte',
          order: 1,
          icon: () => 'cancel',
          execute: (product: LlecoopOrderProduct) => {
            product.initQuantity = 0;
          },
        },
      },
    });
  }
}
