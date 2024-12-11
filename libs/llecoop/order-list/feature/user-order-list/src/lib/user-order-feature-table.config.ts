import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { formatUserOrderStatus } from '@plastik/llecoop/order-list/util';
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
  private readonly userOrderStore = inject(LlecoopUserOrderStore);
  private readonly orderListStore = inject(LLecoopOrderListStore);

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
      execute: status =>
        formatUserOrderStatus(this.sanitizer, status as LlecoopUserOrder['status']),
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

  private readonly orderDoneStatusCache = new Map<string, boolean>();

  private checkIfOrderIsDone(order: LlecoopUserOrder): boolean {
    if (!order) return false;

    const cacheKey = `${order.orderListId}`;
    if (this.orderDoneStatusCache.has(cacheKey)) {
      return this.orderDoneStatusCache.get(cacheKey) as boolean;
    }

    const isDone = this.orderListStore.entityMap()[order.orderListId]?.status === 'done';
    this.orderDoneStatusCache.set(cacheKey, isDone);

    return isDone;
  }

  getTableDefinition(): TableDefinition<LlecoopUserOrder> {
    // Clear cache when getting new table definition
    this.orderDoneStatusCache.clear();

    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.columnProperties,
      paginationVisibility: {
        hidePageSize: true,
        hideRangeLabel: true,
        hideRangeButtons: true,
        hidePaginationFirstLastButtons: true,
      },
      sort: this.userOrderStore.sorting,
      count: this.userOrderStore.count,
      caption: 'Llistat de les meves comandes',
      getData: () => this.userOrderStore.entities(),
      actionsColStyles: 'min-w-[135px]',
      actions: {
        VIEW: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => !this.checkIfOrderIsDone(userOrder),
          description: () => 'Resum de la comanda',
          order: 1,
          icon: () => 'visibility',
          link: (userOrder: LlecoopUserOrder) => `resum/${userOrder?.id}`,
        },
        EDIT: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => this.checkIfOrderIsDone(userOrder),
          description: () => 'Edita la comanda',
          order: 2,
        },
        DELETE: {
          visible: () => true,
          disabled: (userOrder: LlecoopUserOrder) => this.checkIfOrderIsDone(userOrder),
          description: () => 'Elimina la comanda',
          order: 3,
        },
      },
    } as TableDefinition<LlecoopUserOrder>;
  }
}
