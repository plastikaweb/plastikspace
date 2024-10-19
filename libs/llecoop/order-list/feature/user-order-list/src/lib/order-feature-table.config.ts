import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopUserOrder, llecoopUserOrderStatus } from '@plastik/llecoop/entities';
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
export class LlecoopOrderSearchFeatureTableConfig
  implements TableStructureConfig<LlecoopUserOrder>
{
  private readonly sanitizer = inject(DomSanitizer);

  private readonly name: TableColumnFormatting<LlecoopUserOrder, 'LINK'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[240px]'],
    formatting: {
      type: 'LINK',
      execute: (_, element) => {
        const link = `
        <a class="font-bold uppercase"
          data-link="soci/comanda/${element?.id}">
          ${element?.name}
        </a>`;
        return this.sanitizer.bypassSecurityTrustHtml(`${link}`) as SafeHtml;
      },
    },
  };

  private readonly price: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'price',
    title: 'Preu total',
    propertyPath: '',
    sorting: true,
    cssClasses: ['hidden md:flex min-w-[100px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => {
        const price = element?.cart.reduce((acc, item) => {
          return acc + (item.finalPrice || item.initPrice);
        }, 0);
        return this.sanitizer.bypassSecurityTrustHtml(`${Number(price).toFixed(2)} €`) as SafeHtml;
      },
    },
  };

  private readonly numberOfProducts: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'numberOfProducts',
    title: 'N. de productes',
    propertyPath: 'cart',
    sorting: true,
    cssClasses: ['hidden md:flex min-w-[100px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => element?.cart.length || 0,
    },
  };

  private readonly status: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'status',
    title: 'Estat de la comanda',
    propertyPath: 'status',
    sorting: true,
    cssClasses: ['hidden md:flex min-w-[120px]'],
    formatting: {
      type: 'CUSTOM',
      execute: value => {
        const status =
          llecoopUserOrderStatus[value as LlecoopUserOrder['status']] ||
          llecoopUserOrderStatus.waiting;

        return this.sanitizer.bypassSecurityTrustHtml(`
          <p class="flex gap-tiny justify-center items-center">
          <span class="material-icons ${status?.class}">${status?.icon}</span>
          <span class="capitalize">${status?.label}</span>
          </p>
          `) as SafeHtml;
      },
    },
  };

  private readonly createdAt = createdAt<LlecoopUserOrder>();
  private readonly updatedAt = updatedAt<LlecoopUserOrder>();

  private readonly columnProperties: TableColumnFormatting<LlecoopUserOrder, FormattingTypes>[] = [
    this.name,
    this.price,
    this.numberOfProducts,
    this.status,
    this.createdAt,
    this.updatedAt,
  ];

  getTableStructure(): WritableSignal<TableControlStructure<LlecoopUserOrder>> {
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
      caption: 'Llistat de les meves comandes',
      actions: {
        EDIT: {
          visible: () => true,
          description: () => 'Edita la comanda',
          order: 2,
        },
        DELETE: {
          visible: () => true,
          description: () => 'Elimina la comanda',
          order: 3,
        },
      },
    });
  }
}
