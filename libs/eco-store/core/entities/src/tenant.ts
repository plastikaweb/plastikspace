import { BasePocketBaseEntity, LocalizedFields, UserContact } from '@plastik/core/entities';

export type SlotDays =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type TimePoint = string;
export type TimeRange = string;

export type EcoStoreTenantLogisticsDeliveryType = 'pickup' | 'delivery';
export interface EcoStoreTenantLogisticsDeliveryTier {
  min: number;
  cost: number;
}

export interface EcoStoreTenantLogisticsDeliveryOption {
  type: EcoStoreTenantLogisticsDeliveryType;
  enabled: boolean;
  cost?: number; // you can set a fixed cost or a percentage of the order total. For more complex pricing rules you can use the slot price rules.
  addressOverride?: string; // if set, this address will be used instead of the tenant address
  instructions?: string | LocalizedFields<string> | null; // instructions for the delivery/pickup
  slots?: Record<SlotDays, TimeRange[]>; // the available day - time slots for delivery/pickup
  tiers?: EcoStoreTenantLogisticsDeliveryTier[]; // the available tiers for delivery/pickup
}

export interface EcoStoreTenantLogistics {
  orderWindow: {
    enabled: boolean; // if false the online store is opened 24/7
    openDay?: SlotDays;
    openTime?: TimePoint;
    closeDay?: SlotDays;
    closeTime?: TimePoint;
  };
  options: EcoStoreTenantLogisticsDeliveryOption[];
}

export type EcoStoreTenant = BasePocketBaseEntity &
  UserContact & {
    logo?: string;
    languages: string[];
    themeConfig?: unknown;
    logisticsConfig: EcoStoreTenantLogistics;
    active?: boolean;
  };

export type EcoStoreTenantAddress = Pick<
  BasePocketBaseEntity,
  'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'
> &
  UserContact & {
    tenant: EcoStoreTenant['id'];
    slots: Record<SlotDays, TimeRange[]>;
  };
