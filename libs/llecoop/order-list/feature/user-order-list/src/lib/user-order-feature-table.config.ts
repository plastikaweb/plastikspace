import { inject, Injectable, signal, Signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopUserOrder, llecoopUserOrderStatus } from '@plastik/llecoop/entities';
import { LlecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { createdAt, updatedAt } from '@plastik/llecoop/util';
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
export class LlecoopUserOrderSearchFeatureTableConfig
  implements TableStructureConfig<LlecoopUserOrder>
{
  private readonly sanitizer = inject(DomSanitizer);
  private readonly store = inject(LlecoopUserOrderStore);

  private readonly name: TableColumnFormatting<LlecoopUserOrder, 'LINK'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'LINK',
      execute: (_, userOrder) => {
        const link = `
        <a class="font-bold uppercase"
          data-link="soci/comanda/${userOrder?.id}">
          ${userOrder?.name}
        </a>`;
        return this.sanitizer.bypassSecurityTrustHtml(`${link}`) as SafeHtml;
      },
    },
  };

  private readonly price: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'totalPrice',
    title: 'Preu total',
    propertyPath: '',
    sorting: true,
    cssClasses: ['max-w-[100px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, userOrder) => {
        const price = userOrder?.totalPrice || 0;
        return this.sanitizer.bypassSecurityTrustHtml(`${Number(price).toFixed(2)} €`) as SafeHtml;
      },
    },
  };

  private readonly numberOfProducts: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'numberOfProducts',
    title: 'Nre. de productes',
    propertyPath: 'cart',
    sorting: true,
    cssClasses: ['hidden md:flex max-w-[130px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, userOrder) => userOrder?.cart.length || 0,
    },
  };

  private readonly status: TableColumnFormatting<LlecoopUserOrder, 'CUSTOM'> = {
    key: 'status',
    title: 'Estat',
    propertyPath: 'status',
    sorting: true,
    cssClasses: ['max-w-[70px] md:max-w-[150px]'],
    formatting: {
      type: 'CUSTOM',
      execute: userOrder => {
        const status =
          llecoopUserOrderStatus[userOrder as LlecoopUserOrder['status']] ||
          llecoopUserOrderStatus.waiting;

        return this.sanitizer.bypassSecurityTrustHtml(`
          <p class="flex gap-tiny justify-center items-center">
          <span class="material-icons ${status?.class}">${status?.icon}</span>
          <span class="capitalize hidden md:flex">${status?.label}</span>
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
      count: this.store.count,
      caption: 'Llistat de les meves comandes',
      getData: () => this.store.entities(),
      actionsColStyles: 'min-w-[135px]',
      actions: {
        EDIT: {
          visible: () => true,
          description: () => 'Edita la comanda',
          order: 1,
        },
        DELETE: {
          visible: () => true,
          description: () => 'Elimina la comanda',
          order: 2,
        },
      },
    }) as Signal<TableDefinition<LlecoopUserOrder>>;
  }
}
