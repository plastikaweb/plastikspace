import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  getLlecoopProductBasedUnitText,
  getLlecoopProductUnitSuffix,
  LlecoopOrderProduct,
} from '@plastik/llecoop/entities';
import { LlecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
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
export class LlecoopUserOrderResumeTableConfig
  implements TableStructureConfig<LlecoopOrderProduct>
{
  readonly #sanitizer = inject(DomSanitizer);
  readonly #store = inject(LlecoopUserOrderStore);

  readonly #name: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sticky: true,
    cssClasses: ['min-w-[160px] md:min-w-[250px] py-tiny', 'flex flex-col justify-start'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, product) => {
        const name = `<p class="font-bold uppercase">${product?.name}</p>`;
        const unit = product?.unit
          ? `<p class="font-bold text-sm">${Number(product?.price).toFixed(2)} € x ${getLlecoopProductBasedUnitText(product.unit)}</p>`
          : '';
        const info = product?.info ? `<p class="font-bold">${product?.info}</p>` : '';
        const provider = product?.provider ? `<li>Proveïdor: ${product?.provider}</li>` : '';
        const origin = product?.origin ? `<li>Procedència: ${product?.origin}</li>` : '';
        const extra = `<ul class="hidden md:block">${provider}${origin}</ul>`;
        return this.#sanitizer.bypassSecurityTrustHtml(`${name}${info}${unit}${extra}`) as SafeHtml;
      },
    },
  };

  readonly #initQuantity: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'initQuantity',
    title: 'Quantitat demanada',
    propertyPath: 'initQuantity',
    cssClasses: ['min-w-[170px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, orderProduct) => {
        return value
          ? `${value} ${getLlecoopProductUnitSuffix(orderProduct?.unit ?? { type: 'unit' })}`
          : '-';
      },
    },
  };

  readonly #finalQuantity: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'finalQuantity',
    title: 'Quantitat final',
    propertyPath: 'finalQuantity',
    cssClasses: ['min-w-[170px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, orderProduct) => {
        return value
          ? `${value} ${getLlecoopProductUnitSuffix(orderProduct?.unit ?? { type: 'unit' })}`
          : '-';
      },
    },
  };

  readonly #finalPrice: TableColumnFormatting<LlecoopOrderProduct, 'CURRENCY'> = {
    key: 'finalPrice',
    title: 'Preu final',
    propertyPath: 'finalPrice',
    cssClasses: ['w-[120px]'],
    formatting: {
      type: 'CURRENCY',
      extras: () => ({
        currency: '€',
        numberDigitsInfo: '1.2-2',
      }),
    },
  };

  readonly #iva: TableColumnFormatting<LlecoopOrderProduct, 'PERCENTAGE'> = {
    key: 'iva',
    title: 'IVA',
    propertyPath: 'iva',
    cssClasses: ['w-[120px]'],
    formatting: {
      type: 'PERCENTAGE',
    },
  };

  readonly #extraInfo: TableColumnFormatting<LlecoopOrderProduct, 'TEXT'> = {
    key: 'extraInfo',
    title: 'Comentaris',
    propertyPath: 'extraInfo',
    cssClasses: ['w-[250px]', 'flex max-w-[250px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #columnProperties: TableColumnFormatting<LlecoopOrderProduct, FormattingTypes>[] = [
    this.#name,
    this.#initQuantity,
    this.#finalQuantity,
    this.#iva,
    this.#finalPrice,
    this.#extraInfo,
  ];

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      caption: 'Llistat de productes',
      noPagination: true,
      getData: () => this.#store.selectedItem()?.cart || [],
    } as TableDefinition<LlecoopOrderProduct>;
  }
}
