import { inject, Injectable, Signal, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
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
  readonly #store = inject(llecoopUserOrderStore);
  readonly #productBaseUnitTextPipe = inject(LlecoopProductBaseUnitTextPipe);
  readonly #productUnitSuffixPipe = inject(LlecoopProductUnitSuffixPipe);

  readonly #name: TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    pathToKey: 'normalizedName',
    sticky: true,
    cssClasses: ['min-w-[160px] md:min-w-[250px] py-tiny', 'flex flex-col justify-start'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, product) => {
        const name = `<p class="font-bold uppercase">${product?.name}</p>`;
        const unit = product?.unit
          ? `<p class="font-bold text-sm">${Number(product?.price).toFixed(2)} € x ${this.#productBaseUnitTextPipe.transform(product.unit)}</p>`
          : '';
        const info = product?.info ? `<p class="font-bold">${product?.info}</p>` : '';
        const provider = product?.provider ? `<li>Proveïdor: ${product?.provider}</li>` : '';
        const origin = product?.origin ? `<li>Procedència: ${product?.origin}</li>` : '';
        const extra = `<ul class="hidden md:block">${provider}${origin}</ul>`;
        return this.#sanitizer.bypassSecurityTrustHtml(`${name}${info}${unit}${extra}`) as SafeHtml;
      },
    },
  };

  readonly #initQuantity: TableColumnFormatting<LlecoopOrderProduct, 'QUANTITY'> = {
    key: 'initQuantity',
    title: 'Quantitat inici',
    pathToKey: 'initQuantity',
    cssClasses: ['min-w-[80px]'],
    formatting: {
      type: 'QUANTITY',
      extras: item => {
        const unit = item?.unit ?? { type: 'unit' };
        const suffix = this.#productUnitSuffixPipe.transform(unit);
        const numberDigitsInfo = suffix === 'kg' ? '1.2-2' : '1.0-0';
        return {
          suffix,
          numberDigitsInfo,
        };
      },
    },
  };

  readonly #finalQuantity: TableColumnFormatting<LlecoopOrderProduct, 'QUANTITY'> = {
    key: 'finalQuantity',
    title: 'Quantitat final',
    pathToKey: 'finalQuantity',
    cssClasses: ['min-w-[80px]'],
    formatting: {
      type: 'QUANTITY',
      extras: item => {
        const unit = item?.unit ?? { type: 'unit' };
        const suffix = this.#productUnitSuffixPipe.transform(unit);
        const numberDigitsInfo = suffix === 'kg' ? '1.2-2' : '1.0-0';
        return {
          suffix,
          numberDigitsInfo,
        };
      },
    },
  };

  readonly #finalPrice: TableColumnFormatting<LlecoopOrderProduct, 'CURRENCY'> = {
    key: 'finalPrice',
    title: 'Preu total',
    pathToKey: 'finalPrice',
    cssClasses: ['min-w-[120px]'],
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
    pathToKey: 'iva',
    cssClasses: ['w-[60px]'],
    formatting: {
      type: 'PERCENTAGE',
    },
  };

  readonly #extraInfo: TableColumnFormatting<LlecoopOrderProduct, 'TEXT'> = {
    key: 'extraInfo',
    title: 'Comentaris',
    pathToKey: 'extraInfo',
    cssClasses: ['w-[150px]', 'flex max-w-[250px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #columnProperties: Signal<
    TableColumnFormatting<LlecoopOrderProduct, FormattingTypes>[]
  > = signal([
    this.#name,
    this.#initQuantity,
    this.#finalQuantity,
    this.#iva,
    this.#finalPrice,
    this.#extraInfo,
  ]);

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
