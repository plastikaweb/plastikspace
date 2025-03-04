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
import { UiOrderStatusChipComponent } from '@plastik/llecoop/order-status-chip';
import { TableColumnFormatting } from '@plastik/shared/table/entities';

/**
 * Formats the delivery date for a user order.
 * @param {Partial<LlecoopUserOrder>} order - The user order to format the delivery date for.
 * @param {DomSanitizer} sanitizer - The Angular sanitizer service.
 * @returns {SafeHtml} The formatted delivery date as a SafeHtml object.
 */
export function formatUserOrderDeliveryDate(
  order: Partial<LlecoopUserOrder>,
  sanitizer: DomSanitizer
): SafeHtml {
  const deliveryDate = order?.deliveryDate as LlecoopUserOrder['deliveryDate'];
  const deliveryType = order?.deliveryType as LlecoopUserOrder['deliveryType'];
  const findDeliveryDate = llecoopUserOrderDateOptions?.[deliveryType]?.find(
    date => date?.value === deliveryDate
  );
  const deliveryTime = order?.deliveryTime;
  const findDeliveryTime = llecoopUserOrderTimeOptions[deliveryType]?.find(
    date => date.value === deliveryTime
  );

  return sanitizer.bypassSecurityTrustHtml(
    `<p>${findDeliveryDate?.label} ${findDeliveryTime?.label}</p>`
  );
}

/**
 * @description Checks if the passed value is a LlecoopUserOrder.
 * @param {LlecoopOrder | LlecoopUserOrder} value The value to check.
 * @returns {value is LlecoopUserOrder} True if the value is a LlecoopUserOrder, false otherwise.
 */
export function isLlecoopUserOrder(
  value: LlecoopOrder | LlecoopUserOrder
): value is LlecoopUserOrder {
  return 'userId' in value;
}

/**
 * @description Formats the status of an order and returns it as a SafeHtml object.
 * @template T
 * @param {string} key The key of the column.
 * @param {Capitalize<string>} title The title of the column.
 * @param {string} pathToKey The property path of the column.
 * @param {string[]} cssClasses The CSS classes of the column.
 * @param {boolean} sorting Whether the column is sortable or not.
 * @returns {TableColumnFormatting<T, 'COMPONENT'>} The formatted column.
 */
export function formatOrderStatus<T extends LlecoopUserOrder | LlecoopOrder>(
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
        const orderStatus = isLlecoopUserOrder(element)
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
