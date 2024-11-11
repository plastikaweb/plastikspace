import { inject, Injectable, signal, Signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { createdAt, productCategoryColumn, updatedAt } from '@plastik/llecoop/util';
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
export class LlecoopProductSearchFeatureTableConfig
  implements TableStructureConfig<LlecoopProduct>
{
  private readonly sanitizer = inject(DomSanitizer);
  private readonly store = inject(LlecoopProductStore);

  private readonly name: TableColumnFormatting<LlecoopProduct, 'LINK'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[240px] py-tiny'],
    formatting: {
      type: 'LINK',
      execute: (_, product) => {
        const link = `<a class="font-bold uppercase"
          data-link="admin/producte/${product?.id}">
          ${product?.name}
        </a>`;
        const info = product?.info ? `<li class="font-bold">${product?.info}</li>` : '';
        const provider = product?.provider ? `<li>Proveïdor: ${product?.provider}</li>` : '';
        const origin = product?.origin ? `<li>Procedència: ${product?.origin}</li>` : '';
        const extra = `<ul>${info}${provider}${origin}</ul>`;
        return this.sanitizer.bypassSecurityTrustHtml(`${link}${extra}`) as SafeHtml;
        // return this.sanitizer.bypassSecurityTrustHtml(`${link}`) as SafeHtml;
      },
    },
  };

  private readonly price: TableColumnFormatting<LlecoopProduct, 'CURRENCY'> = {
    key: 'price',
    title: 'Preu',
    propertyPath: 'price',
    sorting: true,
    cssClasses: ['hidden md:flex md:min-w-[100px]'],
    formatting: {
      type: 'CURRENCY',
      extras: () => ({
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      }),
    },
  };

  private readonly iva: TableColumnFormatting<LlecoopProduct, 'PERCENTAGE'> = {
    key: 'iva',
    title: 'IVA',
    propertyPath: 'iva',
    cssClasses: ['hidden md:flex md:min-w-[100px]'],
    formatting: {
      type: 'PERCENTAGE',
    },
  };

  private readonly unit: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'unit',
    title: 'Presentació',
    propertyPath: 'unit.base',
    cssClasses: ['hidden md:flex md:min-w-[150px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, product) => {
        switch (product?.unit?.type) {
          case 'unitWithFixedVolume':
            return `volum per unitat: ${Number(value)} l`;
          case 'unitWithFixedWeight':
            return `pes per unitat: ${Number(value)} kg`;
          case 'unitWithVariableWeight':
            return `pes aprox. per unitat: ${Number(value)} kg`;
          case 'weight':
            return 'quantitat final a pes';
          default:
            return 'unitat';
        }
      },
    },
  };

  private readonly priceWithIva: TableColumnFormatting<LlecoopProduct, 'CURRENCY'> = {
    key: 'priceWithIva',
    title: 'Preu amb IVA',
    propertyPath: 'priceWithIva',
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

  private readonly isAvailable: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'isAvailable',
    title: 'Disponible',
    propertyPath: 'isAvailable',
    sorting: true,
    showTitle: false,
    cssClasses: ['hidden md:flex md:min-w-[120px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, product) => (product?.isAvailable ? '✔' : '✘'),
    },
  };

  private readonly stock: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'stock',
    title: 'Stock',
    propertyPath: 'stock',
    cssClasses: ['hidden md:flex md:min-w-[125px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, product) => {
        return !value ? '-' : `${value} ${product?.unit?.type === 'weight' ? 'kg' : 'u.'}`;
      },
    },
  };

  private readonly createdAt = createdAt<LlecoopProduct>();
  private readonly updatedAt = updatedAt<LlecoopProduct>();

  private readonly columnProperties: TableColumnFormatting<LlecoopProduct, FormattingTypes>[] = [
    this.isAvailable,
    this.name,
    productCategoryColumn<LlecoopProduct>(),
    this.unit,
    this.stock,
    this.price,
    this.iva,
    this.priceWithIva,
    this.createdAt,
    this.updatedAt,
  ];

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return signal({
      ...defaultTableConfig,
      columnProperties: this.columnProperties,
      paginationVisibility: {
        hidePageSize: true,
        hideRangeLabel: true,
        hideRangeButtons: true,
        hidePaginationFirstLastButtons: true,
      },
      sort: this.store.sorting,
      caption: 'Llistat de productes',
      getData: () => this.store.entities(),
      count: this.store.count,
      extraRowStyles: (product: LlecoopProduct) => {
        return !product.isAvailable ? 'marked-ko' : '';
      },
      actionsColStyles: 'min-w-[190px]',
      actions: {
        SET_AVAILABILITY: {
          visible: () => true,
          description: () => 'Canviar la disponibilitat del producte',
          order: 1,
          icon: (product: LlecoopProduct) => (!product.isAvailable ? 'cancel' : 'check_circle'),
          execute: (product: LlecoopProduct) => {
            this.store.update({
              product: { ...product, isAvailable: !product.isAvailable },
              showNotification: false,
            });
          },
        },
        EDIT: {
          visible: () => true,
          description: () => 'Edita el producte',
          order: 2,
        },
        DELETE: {
          visible: () => true,
          description: () => 'Elimina el producte',
          order: 3,
        },
      },
    }) as Signal<TableDefinition<LlecoopProduct>>;
  }
}
