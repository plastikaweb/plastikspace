import {
  BasePocketBaseEntityWithTenantRef,
  LocalizedFields,
  UserContact,
} from '@plastik/core/entities';
import { EcoStoreCartItem } from './cart';
import { ProductUnitType } from './product';
import { EcoStoreTenantLogisticsDeliveryType, SlotDays, TimeRange } from './tenant';

export type EcoStoreOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export type EcoStorePaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface EcoStoreOrderItemSnapshot {
  productId: string;
  name: string;
  categoryName: string | LocalizedFields<string>;
  unitType: ProductUnitType;
  lockedPrice: number;
  taxRate?: number;
  requestedQuantity: number;
  finalQuantity?: number;
  isAvailable: boolean;
  lineTotal: number;
}

export type EcoStoreOrder = BasePocketBaseEntityWithTenantRef & {
  orderNumber: string;
  user: UserContact['id'];
  status: EcoStoreOrderStatus;
  paymentStatus: EcoStorePaymentStatus;
  deliveryMethod: EcoStoreTenantLogisticsDeliveryType;
  day: SlotDays | null;
  time: TimeRange | null;
  address: UserContact;
  notes: string;
  orderCycle?: string;
  language: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  items: EcoStoreOrderItemSnapshot[];
};

/**
 * Payload type for creating a new order. Omits PocketBase auto-generated fields.
 */
export type NewEcoStoreOrder = Omit<
  EcoStoreOrder,
  | 'id'
  | 'collectionId'
  | 'collectionName'
  | 'created'
  | 'updated'
  | 'name'
  | 'normalizedName'
  | 'description'
  | 'tenant'
>;

/**
 * Generates a human-readable order number with date prefix and random suffix.
 * @returns {string} A formatted order number string in the format `YYMMDD-XXXX`.
 */
export const generateOrderNumber = (): string => {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${date}-${random}`;
};

/**
 * Converts a cart item into an order item snapshot, locking in the current price.
 * @param {EcoStoreCartItem} item - The cart item to convert.
 * @returns {EcoStoreOrderItemSnapshot} An order item snapshot with locked pricing data.
 */
export const toOrderItemSnapshot = (item: EcoStoreCartItem): EcoStoreOrderItemSnapshot => ({
  productId: item.product.id,
  name: item.product.name,
  categoryName: item.product.categoryName,
  unitType: item.product.unitType,
  lockedPrice: item.product.priceWithIva,
  taxRate: item.product.iva,
  requestedQuantity: item.quantity,
  isAvailable: item.product.inStock,
  lineTotal: item.quantity * item.product.priceWithIva,
});
