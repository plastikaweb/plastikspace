import { DocumentReference } from '@angular/fire/firestore';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity, FormSelectOption } from '@plastik/core/entities';

import { LlecoopBaseProduct } from './product';
import { LlecoopUser } from './user';

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
  'id' | 'name' | 'price' | 'iva' | 'priceWithIva' | 'unit'
> & {
  quantity: number;
  totalPrice: number;
  reviewed: boolean;
};

export interface LlecoopOrder extends BaseEntity {
  initTime?: Date;
  endTime?: Date;
  status: 'waiting' | 'progress' | 'cancel' | 'done';
  availableProducts: LlecoopOrderProduct[];
  orderCount: number;
  orders?: LlecoopUserOrder[];
  total?: LlecoopOrderProductTotal[];
}

export interface LlecoopUserOrder extends BaseEntity {
  userName: string;
  userRef: DocumentReference<LlecoopUser>;
  orderRef: DocumentReference<LlecoopOrder>;
  cart: LlecoopOrderProduct[];
  address: string;
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
  status: 'waiting' | 'review' | 'deliver' | 'cancel' | 'miss';
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
  cancel: {
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
  waiting: {
    label: 'Pendent',
    icon: 'hourglass_empty',
    class: 'text-info',
  },
  review: {
    label: 'Cistella feta',
    icon: 'sync',
    class: 'text-warning',
  },
  deliver: {
    label: 'Cistella entregada',
    icon: 'local_shipping',
    class: 'text-warning',
  },
  cancel: {
    label: 'Cancel·lada',
    icon: 'cancel',
    class: 'text-error',
  },
  miss: {
    label: 'No revisada',
    icon: 'error',
    class: 'text-error',
  },
} as const;
