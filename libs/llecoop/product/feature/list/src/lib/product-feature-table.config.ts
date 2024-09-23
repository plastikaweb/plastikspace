import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { createdAt, updatedAt } from '@plastik/llecoop/util';
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
export class LlecoopProductSearchFeatureTableConfig
  implements TableStructureConfig<LlecoopProduct>
{
  private readonly sanitizer = inject(DomSanitizer);
  private readonly store = inject(LlecoopProductStore);

  private readonly name: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[200px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => {
        const name = `<span class="font-bold">${element?.name}</span>`;
        const description = element?.description ? `<span>${element.description}</span>` : '';
        return this.sanitizer.bypassSecurityTrustHtml(`${name}${description}`) as SafeHtml;
      },
    },
  };

  private readonly category: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'category',
    title: 'Categoria',
    propertyPath: 'category',
    sorting: true,
    cssClasses: ['hidden md:flex md:min-w-[150px] justify-center', 'flex'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => {
        const value = element?.category?.name || '';
        if (value) {
          const htmlString = `<p class="flex rounded-md capitalize
                                px-sub py-tiny
                                text-white tracking-wider"
                                style="background-color:${element?.category?.color || '#330033'}">
                                ${value || '-'}
                              </p>`;
          return this.sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
        }
        return '-';
      },
    },
  };

  private readonly origin: TableColumnFormatting<LlecoopProduct, 'TEXT'> = {
    key: 'origin',
    title: 'Procedència',
    propertyPath: 'origin',
    sorting: true,
    cssClasses: ['hidden lg:flex lg:min-w-[150px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly provider: TableColumnFormatting<LlecoopProduct, 'TEXT'> = {
    key: 'provider',
    title: 'Proveïdor',
    propertyPath: 'provider',
    sorting: true,
    cssClasses: ['hidden lg:flex lg:min-w-[150px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly price: TableColumnFormatting<LlecoopProduct, 'CURRENCY'> = {
    key: 'price',
    title: 'Preu',
    propertyPath: 'price',
    sorting: true,
    cssClasses: ['hidden md:flex min-w-[100px]'],
    formatting: {
      type: 'CURRENCY',
      extras: {
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      },
    },
  };

  private readonly iva: TableColumnFormatting<LlecoopProduct, 'PERCENTAGE'> = {
    key: 'iva',
    title: 'IVA',
    propertyPath: 'iva',
    cssClasses: ['hidden md:flex min-w-[100px]'],
    formatting: {
      type: 'PERCENTAGE',
    },
  };

  private readonly priceWithIva: TableColumnFormatting<LlecoopProduct, 'PERCENTAGE'> = {
    key: 'priceWithIva',
    title: 'Preu amb IVA',
    propertyPath: 'priceWithIva',
    sorting: true,
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'CURRENCY',
      extras: {
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      },
    },
  };

  private readonly isAvailable: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'isAvailable',
    title: 'Disponible',
    propertyPath: 'isAvailable',
    sorting: true,
    cssClasses: ['min-w-[110px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => (element?.isAvailable ? '✔' : '✘'),
    },
  };

  private readonly stock: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'stock',
    title: 'Stock',
    propertyPath: 'stock',
    cssClasses: ['hidden md:flex min-w-[125px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        return `${value} ${element?.unit?.type === 'weight' ? 'kg' : 'u.'}`;
      },
    },
  };

  private readonly createdAt = createdAt<LlecoopProduct>();
  private readonly updatedAt = updatedAt<LlecoopProduct>();

  private readonly columnProperties: TableColumnFormatting<LlecoopProduct, FormattingTypes>[] = [
    this.isAvailable,
    this.name,
    this.category,
    this.price,
    this.iva,
    this.priceWithIva,
    this.origin,
    this.provider,
    this.createdAt,
    this.updatedAt,
    this.stock,
  ];

  getTableStructure(): WritableSignal<TableControlStructure<LlecoopProduct>> {
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
      caption: 'Llistat de productes',
      extraRowStyles: element => {
        return !element.isAvailable ? 'marked opacity-50' : '';
      },
      actions: {
        CUSTOM: {
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
    });
  }
}
