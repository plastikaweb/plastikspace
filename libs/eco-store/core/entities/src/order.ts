import {
  BasePocketBaseEntityWithTenantRef,
  LocalizedFields,
  UserContact,
} from '@plastik/core/entities';
import { SharedChipType } from '@plastik/shared/entities';
import { EcoStoreCartItem } from './cart';
import { ProductUnitType } from './product';
import { EcoStoreTenantLogisticsDeliveryType, SlotDays, TimeRange } from './tenant';

export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'DELIVERED',
  'CANCELLED',
] as const;

export type EcoStoreOrderStatus = (typeof ORDER_STATUSES)[number];

/** Single source of truth for all per-status metadata. */
const ORDER_STATUS_CONFIG: Record<EcoStoreOrderStatus, { type: SharedChipType; icon: string }> = {
  PENDING: { type: 'warning', icon: 'clock_loader_10' },
  CONFIRMED: { type: 'warning', icon: 'thumb_up' },
  PREPARING: { type: 'warning', icon: 'pending' },
  READY: { type: 'warning', icon: 'box' },
  DELIVERED: { type: 'success', icon: 'check_circle' },
  CANCELLED: { type: 'error', icon: 'error' },
} as const;

/** Maps order status to a Material icon name. */
export const ORDER_STATUS_ICON_MAP = Object.fromEntries(
  ORDER_STATUSES.map(status => [status, ORDER_STATUS_CONFIG[status].icon])
) as Record<EcoStoreOrderStatus, string>;

/** Status options for select fields (label derives from convention). */
export const ORDER_STATUS_OPTIONS = ORDER_STATUSES.map(status => ({
  value: status,
  label: `orders.status.${status.toLowerCase()}`,
  icon: ORDER_STATUS_CONFIG[status].icon,
  type: ORDER_STATUS_CONFIG[status].type,
}));

/** Maps order status to translation keys. */
export const ORDER_STATUS_LABEL_MAP = Object.fromEntries(
  ORDER_STATUSES.map(status => [status, `orders.status.${status.toLowerCase()}`])
) as Record<EcoStoreOrderStatus, string>;

/** Maps order status to a semantic chip type. */
export const ORDER_STATUS_TYPE_MAP = Object.fromEntries(
  ORDER_STATUSES.map(status => [status, ORDER_STATUS_CONFIG[status].type])
) as Record<EcoStoreOrderStatus, SharedChipType>;

/** Maps delivery method to an icon name. */
export const ORDER_DELIVERY_ICON_MAP: Record<EcoStoreTenantLogisticsDeliveryType, string> = {
  delivery: 'local_shipping',
  pickup: 'store',
} as const;

/** Maps delivery method to a translation key. */
export const ORDER_DELIVERY_LABEL_MAP: Record<EcoStoreTenantLogisticsDeliveryType, string> = {
  delivery: 'orders.deliveryMethod.delivery',
  pickup: 'orders.deliveryMethod.pickup',
} as const;

export type EcoStorePaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface EcoStoreOrderItemSnapshot {
  productId: string;
  name: string | LocalizedFields<string>;
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
 * @description Generates a human-readable order number with tenant name, timestamp and random suffix.
 * @param {string} tenantNormalizedName - The tenant normalized name.
 * @returns {string} A formatted order number string in the format `TENANT-TIMESTAMP-XXX.
 */
export const generateOrderNumber = (tenantNormalizedName: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${tenantNormalizedName.toUpperCase()}-${timestamp}-${random}`;
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
