import { BasePocketBaseEntityWithTenantRef, UserContact } from '@plastik/core/entities';
import { EcoStoreProductWithCategoryName } from './product';
import { EcoStoreTenantLogisticsDeliveryType, SlotDays, TimeRange } from './tenant';

export type EcoStoreCartStatus = 'ACTIVE' | 'DONE' | 'EXPIRED';

export interface EcoStoreCartItem {
  product: EcoStoreProductWithCategoryName;
  quantity: number;
  hasPriceChanged?: boolean;
  oldPriceWithIva?: number;
}

export interface EcoStoreCart extends BasePocketBaseEntityWithTenantRef {
  user: UserContact['id'];
  items: EcoStoreCartItem[];
  status: EcoStoreCartStatus;
  expiresAt: Date | null;
  orderCycle: string | null;
  notes: string | null;
  address: UserContact | null;
  deliveryMethod: EcoStoreTenantLogisticsDeliveryType;
  day: SlotDays | null;
  time: TimeRange | null;
  noDayAndTime: boolean;
  shipping: number;
  tax: number;
  subtotal: number;
  total: number;
}
