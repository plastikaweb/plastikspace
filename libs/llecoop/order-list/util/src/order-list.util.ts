import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  LlecoopOrder,
  llecoopOrderStatus,
  LlecoopUserOrder,
  llecoopUserOrderDateOptions,
  llecoopUserOrderStatus,
  llecoopUserOrderTimeOptions,
} from '@plastik/llecoop/entities';

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
 * Formats the status of a user order and returns it as a SafeHtml object.
 * @param {DomSanitizer} sanitizer - The Angular sanitizer service.
 * @param {LlecoopUserOrder['status']} orderStatus - The status of the user order.
 * @param {boolean} showLabel - Whether to show the label or not.
 * @param {boolean} showIcon - Whether to show the icon or not.
 * @returns {SafeHtml} The formatted status as a SafeHtml object.
 */
export function formatUserOrderStatus(
  sanitizer: DomSanitizer,
  orderStatus?: LlecoopUserOrder['status'],
  showLabel = true,
  showIcon = true
): SafeHtml {
  if (!orderStatus) {
    return sanitizer.bypassSecurityTrustHtml('<span>No Status</span>') as SafeHtml;
  }

  const status = llecoopUserOrderStatus[orderStatus];

  return sanitizer.bypassSecurityTrustHtml(`
    <p class="flex gap-tiny justify-center items-center">
      ${showIcon ? `<span class="material-icons ${status?.class}">${status?.icon}</span>` : ``}
      ${showLabel ? `<span class="capitalize hidden md:flex">${status?.label}</span>` : ``}
    </p>
    `) as SafeHtml;
}

/**
 * Formats the status of an order and returns it as a SafeHtml object.
 * @param {DomSanitizer} sanitizer - The Angular sanitizer service.
 * @param {LlecoopOrder['status']} orderStatus - The status of the order.
 * @returns {SafeHtml} The formatted status as a SafeHtml object.
 */
export function formatOrderListStatus(
  sanitizer: DomSanitizer,
  orderStatus?: LlecoopOrder['status']
): SafeHtml {
  if (!orderStatus) {
    return sanitizer.bypassSecurityTrustHtml('<span>No Status</span>') as SafeHtml;
  }

  const status = llecoopOrderStatus[orderStatus];

  return sanitizer.bypassSecurityTrustHtml(`
    <p class="flex gap-tiny justify-center items-center">
      <span class="material-icons ${status?.class}">${status?.icon}</span>
      <span class="capitalize hidden md:flex">${status?.label}</span>
    </p>
    `) as SafeHtml;
}
