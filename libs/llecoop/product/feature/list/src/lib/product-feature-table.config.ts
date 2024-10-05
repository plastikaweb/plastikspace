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

  private readonly name: TableColumnFormatting<LlecoopProduct, 'LINK'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[240px]'],
    formatting: {
      type: 'LINK',
      execute: (_, element) => {
        const link = `<a class="font-bold uppercase"
          data-link="admin/producte/${element?.id}">
          ${element?.name}
        </a>`;
        const info = element?.info ? `<li class="font-bold">${element?.info}</li>` : '';
        const provider = element?.provider ? `<li>Proveïdor: ${element?.provider}</li>` : '';
        const origin = element?.origin ? `<li>Procedència: ${element?.origin}</li>` : '';
        const extra = `<ul>${info}${provider}${origin}</ul>`;
        return this.sanitizer.bypassSecurityTrustHtml(`${link}${extra}`) as SafeHtml;
      },
    },
  };

  private readonly category: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'categoryName',
    title: 'Categoria',
    propertyPath: 'category.name',
    cssClasses: ['hidden md:flex md:min-w-[210px] justify-start'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        if (value) {
          const htmlString = element?.category?.color
            ? `
                              <p class="flex items-center gap-tiny justify-start">
                                <span class="rounded-full w-sub h-sub p-sub"
                                  style="background-color:${element?.category?.color}"></span>
                                <span class="capitalize">${value}</span>
                              </p>`
            : `<p class="capitalize">${value}</p>`;
          return this.sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
        }
        return '-';
      },
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

  private readonly unit: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'unit',
    title: 'Presentació',
    propertyPath: 'unit.base',
    cssClasses: ['hidden md:flex md:min-w-[150px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        switch (element?.unit?.type) {
          case 'unitWithFixedVolume':
            return `volum per unitat: ${Number(value)} l`;
          case 'unitWithFixedWeight':
            return `pes per unitat: ${Number(value)} kg`;
          case 'unitWithVariableWeight':
            return `pes aprox. per unitat: ${Number(value)} kg`;
          default:
            return '-';
        }
      },
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
    showTitle: false,
    cssClasses: ['hidden md:flex min-w-[110px] max-w-[110px]'],
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
        return !value ? '-' : `${value} ${element?.unit?.type === 'weight' ? 'kg' : 'u.'}`;
      },
    },
  };

  private readonly createdAt = createdAt<LlecoopProduct>();
  private readonly updatedAt = updatedAt<LlecoopProduct>();

  private readonly columnProperties: TableColumnFormatting<LlecoopProduct, FormattingTypes>[] = [
    this.isAvailable,
    this.name,
    this.category,
    this.unit,
    this.stock,
    this.price,
    this.iva,
    this.priceWithIva,
    this.createdAt,
    this.updatedAt,
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
        return !element.isAvailable ? 'marked' : '';
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
