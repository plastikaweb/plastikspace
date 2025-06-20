import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity, FormSelectOption } from '@plastik/core/entities';

import { LlecoopBaseProduct } from './product';

export type YearWeek = `${number}${number}${number}${number}-${number}${number}`;

/**
 * @description Checks if a given string is in the format of a YearWeek.
 * @param {string} value - The string to check.
 * @returns {value is YearWeek} - True if the string is in the correct format, false otherwise.
 */
export function isYearWeek(value: string): value is YearWeek {
  return /^\d{4}-([0-4]\d|5[0-3])$/.test(value);
}

export type LlecoopOrderProduct = LlecoopBaseProduct & {
  initQuantity: number;
  finalQuantity: number;
  initPrice: number;
  finalPrice: number;
  extraInfo?: string;
  reviewed?: boolean;
};

export type LlecoopOrderProductTotal = Pick<
  LlecoopOrderProduct,
  'id' | 'name' | 'price' | 'iva' | 'priceWithIva' | 'unit' | 'normalizedName' | 'link'
> & {
  quantity: number;
  totalPrice: number;
  reviewed: boolean;
};

export interface LlecoopOrder extends BaseEntity {
  name: YearWeek;
  initTime?: Date;
  endTime?: Date;
  /**
   * @description The status of the order.
   * 'waiting' means the order is in standby, waiting for the admin and no user orders can be done.
   * 'progress' means the order is being opened and the user can add products to it.
   * 'cancelled' means the order has been cancelled by the admin.
   * 'done' means the order has been closed and completed because the due date has passed
   * @type {'waiting' | 'progress' | 'cancelled' | 'done'}
   * @default 'waiting'
   */
  status: 'waiting' | 'progress' | 'cancelled' | 'done';
  availableProducts: LlecoopOrderProduct[];
  orderCount: number;
  orders?: LlecoopUserOrder[];
  total?: LlecoopOrderProductTotal[];
  userOrdersStatus?: {
    [key in LlecoopUserOrder['status']]: number;
  };
}

export interface LlecoopUserOrderCart {
  id?: EntityId;
  cart: LlecoopOrderProduct[];
  price?: number;
  iva?: number;
  priceWithIva?: number;
  deliveryPrice?: number;
  totalPrice?: number;
  deliveryType?: 'pickup' | 'delivery';
  deliveryTime?: FormSelectOption['value'];
  deliveryDate?: FormSelectOption['value'];
  deliveryInfo?: string;
  userAddress?: string;
  userPhone?: string;
  userName?: string;
  userNormalizedName?: string;
  userId?: EntityId;
  userEmail?: string;
  status?:
    | 'draft'
    | 'submitted'
    | 'inReview'
    | 'readyForDelivery'
    | 'delivered'
    | 'blocked'
    | 'failedDelivery'
    | 'cancelledByUser';
}

export interface LlecoopUserOrder extends BaseEntity {
  userName: string;
  cart: LlecoopOrderProduct[];
  address: string;
  phone: string;
  userNormalizedName: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryTime: FormSelectOption['value'];
  deliveryDate: FormSelectOption['value'];
  deliveryInfo?: string;
  price: number;
  deliveryPrice: number;
  totalPrice: number;
  orderListId: EntityId | string;
  userId: EntityId;
  userEmail?: string;
  /**
   * @description The status of the order
   * 'waiting' means the order is done by the user and is waiting for the admin to review it.
   * 'reviewed' means the order has been reviewed by the admin.
   * 'delivered' means the order has been delivered to the user by the admin.
   * 'blocked' means the order has been blocked by the admin.
   * 'notReviewed' means the order has not been reviewed by the admin when the related order list date due date has passed.
   * 'notDelivered' means the order has not been delivered by the admin when the related order list date due date has passed.
   * @type {'waitingReview' | 'reviewed' | 'delivered' | 'blocked' | 'notReviewed' | 'notDelivered'}
   * @default 'waitingReview'
   */
  status: 'waitingReview' | 'reviewed' | 'delivered' | 'blocked' | 'notReviewed' | 'notDelivered';
}

export const llecoopUserOrderTimeOptions: Record<
  LlecoopUserOrder['deliveryType'],
  FormSelectOption[]
> = {
  pickup: [
    {
      value: '10/11',
      label: 'entre les 10h i les 11h',
    },
    {
      value: '11/12',
      label: 'entre les 11h i les 12h',
    },
    {
      value: '12/13',
      label: 'entre les 12h i les 13h',
    },
    {
      value: '13/14',
      label: 'entre les 13h i les 14h',
    },
  ],
  delivery: [
    {
      value: '16/17',
      label: 'entre les 16h i les 17h',
    },
    {
      value: '17/18',
      label: 'entre les 17h i les 18h',
    },
    {
      value: '18/19',
      label: 'entre les 18h i les 19h',
    },
    {
      value: '19/20',
      label: 'entre les 19h i les 20h',
    },
    {
      value: '20/21',
      label: 'entre les 20h i les 21h',
    },
  ],
} as const;

export const llecoopUserOrderDateOptions: Record<
  LlecoopUserOrder['deliveryType'],
  FormSelectOption[]
> = {
  pickup: [
    {
      value: 'wednesday',
      label: 'dimecres',
    },
    {
      value: 'tuesday',
      label: 'dijous',
    },
  ],
  delivery: [
    {
      value: 'tuesday',
      label: 'dijous',
    },
  ],
} as const;

export const llecoopOrderStatus: Record<
  LlecoopOrder['status'],
  { label: string; icon: string; class: string }
> = {
  waiting: {
    label: 'En espera',
    icon: 'hourglass_empty',
    class: 'text-info',
  },
  progress: {
    label: 'En progrés',
    icon: 'sync',
    class: 'text-warning',
  },
  cancelled: {
    label: 'Cancel·lada',
    icon: 'cancel',
    class: 'text-error',
  },
  done: {
    label: 'Completada',
    icon: 'check_circle',
    class: 'text-success',
  },
} as const;

export const llecoopUserOrderStatus: Record<
  LlecoopUserOrder['status'],
  { label: string; icon: string; class: string }
> = {
  waitingReview: {
    label: 'Per revisar',
    icon: 'hourglass_empty',
    class: 'text-info',
  },
  reviewed: {
    label: 'Cistella feta',
    icon: 'sync',
    class: 'text-warning',
  },
  delivered: {
    label: 'Entregada',
    icon: 'local_shipping',
    class: 'text-success',
  },
  blocked: {
    label: 'Bloquejada',
    icon: 'lock',
    class: 'text-error',
  },
  notReviewed: {
    label: 'No revisada',
    icon: 'error',
    class: 'text-error',
  },
  notDelivered: {
    label: 'No entregada',
    icon: 'error',
    class: 'text-error',
  },
} as const;

export const llecoopUserOrderStatusOptions: FormSelectOption[] = Object.keys(
  llecoopUserOrderStatus
).map(key => ({
  value: key,
  label: llecoopUserOrderStatus[key as LlecoopUserOrder['status']].label,
  icon: llecoopUserOrderStatus[key as LlecoopUserOrder['status']].icon,
  class: llecoopUserOrderStatus[key as LlecoopUserOrder['status']].class,
}));

export const llecoopOrderListStatusOptions: FormSelectOption[] = Object.keys(
  llecoopOrderStatus
).map(key => ({
  value: key,
  label: llecoopOrderStatus[key as LlecoopOrder['status']].label,
  icon: llecoopOrderStatus[key as LlecoopOrder['status']].icon,
  class: llecoopOrderStatus[key as LlecoopOrder['status']].class,
}));
