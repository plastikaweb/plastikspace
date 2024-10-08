import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopOrder, llecoopOrderStatus } from '@plastik/llecoop/entities';
import { createdAt, createFirebaseTimestampTableColumn } from '@plastik/llecoop/util';
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
export class LlecoopOrderListSearchFeatureTableConfig
  implements TableStructureConfig<LlecoopOrder>
{
  private readonly sanitizer = inject(DomSanitizer);

  private readonly name: TableColumnFormatting<LlecoopOrder, 'TEXT'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[240px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly status: TableColumnFormatting<LlecoopOrder, 'CUSTOM'> = {
    key: 'status',
    title: 'Estat',
    propertyPath: 'status',
    sorting: true,
    cssClasses: ['min-w-[240px]'],
    formatting: {
      type: 'CUSTOM',
      execute: value => {
        const status = llecoopOrderStatus[value as LlecoopOrder['status']];
        return this.sanitizer.bypassSecurityTrustHtml(`
          <p class="flex gap-tiny justify-center items-center">
          <span class="material-icons ${status.class}">${status.icon}</span>
          <span class="capitalize">${status.label}</span>
          </p>
          `) as SafeHtml;
      },
    },
  };

  private endTime() {
    return createFirebaseTimestampTableColumn<LlecoopOrder>(
      {
        key: 'endTime',
        title: 'Data de tancament',
        propertyPath: 'endTime',
        cssClasses: ['min-w-[125px]'],
      },
      'dd/MM/yyyy HH:mm:ss'
    );
  }

  private readonly totalProducts: TableColumnFormatting<LlecoopOrder, 'TEXT'> = {
    key: 'totalProducts',
    title: 'Productes inclosos',
    propertyPath: 'availableProducts.length',
    sorting: true,
    cssClasses: ['min-w-[125px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly createdAt = createdAt<LlecoopOrder>();

  private readonly columnProperties: TableColumnFormatting<LlecoopOrder, FormattingTypes>[] = [
    this.name,
    this.status,
    this.endTime(),
    this.totalProducts,
    this.createdAt,
  ];

  getTableStructure(): WritableSignal<TableControlStructure<LlecoopOrder>> {
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
      caption: 'Llistat de comandes setmanals',
      actions: {
        DELETE: {
          visible: (item: LlecoopOrder) => item.status === 'waiting',
          description: () => 'Elimina la comanda',
          order: 1,
        },
      },
    });
  }
}
