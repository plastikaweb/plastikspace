import { inject, Injectable, signal, WritableSignal } from '@angular/core';
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
  private readonly name: TableColumnFormatting<LlecoopProduct, 'TEXT'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly origin: TableColumnFormatting<LlecoopProduct, 'TEXT'> = {
    key: 'origin',
    title: 'Procedència',
    propertyPath: 'origin',
    sorting: true,
    formatting: {
      type: 'TEXT',
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

  private readonly columnProperties: TableColumnFormatting<LlecoopProduct, FormattingTypes>[] = [
    this.name,
    this.origin,
    this.price,
    this.iva,
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
