import { UiOrderStatusChipComponent } from 'ui-order-status-chip';

import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  LlecoopOrder,
  llecoopOrderStatus,
  LlecoopUserOrder,
  llecoopUserOrderDateOptions,
  llecoopUserOrderStatus,
  llecoopUserOrderTimeOptions,
} from '@plastik/llecoop/entities';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TableColumnFormatting } from '@plastik/shared/table/entities';

/**
 * Service to handle user order utilities.
 */
@Injectable({
  providedIn: 'root',
})
export class UserOrderUtilsService {
  readonly #sanitizer = inject(DomSanitizer);
  /**
   * Formats the delivery date and time for a user order.
   * @param {Partial<LlecoopUserOrder>} order - The user order to format.
   * @returns {SafeHtml} The formatted delivery date and time as a SafeHtml object.
   */
  formatDeliveryDateAndTime(order: Partial<LlecoopUserOrder>): SafeHtml {
    const deliveryDate = order?.deliveryDate as LlecoopUserOrder['deliveryDate'];
    const deliveryType = order?.deliveryType as LlecoopUserOrder['deliveryType'];
    const findDeliveryDate = llecoopUserOrderDateOptions?.[deliveryType]?.find(
      date => date?.value === deliveryDate
    );
    const deliveryTime = order?.deliveryTime;
    const findDeliveryTime = llecoopUserOrderTimeOptions[deliveryType]?.find(
      date => date.value === deliveryTime
    );

    return this.#sanitizer.bypassSecurityTrustHtml(
      `<p>${findDeliveryDate?.label} ${findDeliveryTime?.label}</p>`
    );
  }

  /**
   * Checks if a given order is a user order.
   * @param {LlecoopOrder | LlecoopUserOrder} value - The order to check.
   * @returns {boolean} True if the order is a user order, false otherwise.
   */
  isLlecoopUserOrder(value: LlecoopOrder | LlecoopUserOrder): value is LlecoopUserOrder {
    return 'userId' in value;
  }

  /**
   * Formats the status of an order and returns it as a SafeHtml object.
   * @template T
   * @param {string} key The key of the column.
   * @param {Capitalize<string>} title The title of the column.
   * @param {string} pathToKey The property path of the column.
   * @param {string[]} cssClasses The CSS classes of the column.
   * @param {boolean} sorting Whether the column is sortable or not.
   * @returns {TableColumnFormatting<T, 'COMPONENT'>} The formatted column.
   */
  formatOrderStatus<T extends LlecoopUserOrder | LlecoopOrder>(
    key = 'status',
    title: Capitalize<string> = 'Estat',
    pathToKey = 'status',
    cssClasses: [cell?: string, content?: string] = ['min-w-[145px]'],
    sorting = 'status'
  ): TableColumnFormatting<T, 'COMPONENT'> {
    return {
      key,
      title,
      pathToKey,
      sorting,
      cssClasses,
      formatting: {
        type: 'COMPONENT',
        execute: (value, element?: T) => {
          if (!element) {
            throw new Error('Element is required');
          }

          const status = value as T['status'];
          const orderStatus = this.isLlecoopUserOrder(element)
            ? llecoopUserOrderStatus[status as LlecoopUserOrder['status']]
            : llecoopOrderStatus[status as LlecoopOrder['status']];
          return {
            component: UiOrderStatusChipComponent,
            inputs: {
              iconClass: orderStatus?.class || '',
              icon: orderStatus?.icon || '',
              label: orderStatus?.label || '',
            },
          };
        },
      },
    };
  }
}
