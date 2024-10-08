import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { BaseEntity } from '@plastik/core/entities';
import { LlecoopProduct } from './product';
import { LlecoopUser } from './user';

export type LlecoopOrderProduct = Omit<LlecoopProduct, 'stock' | 'isAvailable'> & {
  initQuantity: number;
  finalQuantity: number;
  initOrderPrice: number;
  finalOrderPrice: number;
  extraInfo?: string;
  delivered: boolean;
};

export interface LlecoopOrder extends BaseEntity {
  initTime?: Date;
  endTime: Date;
  status: 'waiting' | 'progress' | 'cancel' | 'done';
  availableProducts: LlecoopOrderProduct[];
}

export interface LlecoopUserOrder extends BaseEntity {
  userRef: DocumentReference<LlecoopUser>;
  orderRef: DocumentReference<LlecoopOrder>;
  cart: LlecoopOrderProduct[];
  address: string;
  deliveryTime: Timestamp;
  deliveryInfo?: string;
}

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
