import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopProduct } from '@plastik/llecoop/entities';
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

  private readonly name: TableColumnFormatting<LlecoopProduct, 'TITLE_CASE'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    formatting: {
      type: 'TITLE_CASE',
    },
  };

  private readonly category: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'category',
    title: 'Categoria',
    propertyPath: 'category',
    sorting: true,
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => {
        const value = element?.category?.name || '';
        const htmlString = `<p class="flex gap-sub justify-center items-center"><span class="w-sm h-sm rounded-full" style="background-color:${element?.category?.color || '#aaaaaa'}"></span><span class="capitalize">${value || 'desconeguda'}</span></p>`;
        return this.sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
      },
    },
  };

  private readonly origin: TableColumnFormatting<LlecoopProduct, 'TITLE_CASE'> = {
    key: 'origin',
    title: 'Procedència',
    propertyPath: 'origin',
    sorting: true,
    formatting: {
      type: 'TITLE_CASE',
    },
  };

  private readonly provider: TableColumnFormatting<LlecoopProduct, 'TITLE_CASE'> = {
    key: 'provider',
    title: 'Proveïdor',
    propertyPath: 'provider',
    sorting: true,
    formatting: {
      type: 'TITLE_CASE',
    },
  };

  private readonly price: TableColumnFormatting<LlecoopProduct, 'CURRENCY'> = {
    key: 'price',
    title: 'Preu',
    propertyPath: 'price',
    sorting: true,
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
    formatting: {
      type: 'PERCENTAGE',
    },
  };

  private readonly priceWithIva: TableColumnFormatting<LlecoopProduct, 'PERCENTAGE'> = {
    key: 'priceWithIva',
    title: 'Preu amb IVA',
    propertyPath: 'priceWithIva',
    sorting: true,
    formatting: {
      type: 'CURRENCY',
      extras: {
        numberDigitsInfo: '1.2-2',
        currency: '€',
        currencyCode: 'EUR',
      },
    },
  };

  private readonly inStock: TableColumnFormatting<LlecoopProduct, 'BOOLEAN_WITH_ICON'> = {
    key: 'inStock',
    title: 'En stock',
    propertyPath: 'inStock',
    sorting: true,
    formatting: {
      type: 'BOOLEAN_WITH_ICON',
      extras: { iconTrue: 'check_circle', iconFalse: '' },
    },
  };

  private readonly columnProperties: TableColumnFormatting<LlecoopProduct, FormattingTypes>[] = [
    this.name,
    this.category,
    this.price,
    this.iva,
    this.priceWithIva,
    this.origin,
    this.provider,
    this.inStock,
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
      caption: 'Product Table Results',
      filter: {
        text: ['name'],
      },
    });
  }
}
