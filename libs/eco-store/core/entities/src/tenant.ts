import { BasePocketBaseEntity, LocalizedFields, UserContact } from '@plastik/core/entities';

export type SlotDays =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAYS_MAP: Record<SlotDays, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
} as const;

export type TimePoint = string;
export type TimeRange = string;

export type EcoStoreTenantLogisticsDeliveryType = 'pickup' | 'delivery';
export interface EcoStoreTenantLogisticsDeliveryTier {
  min: number;
  cost: number;
}

export interface EcoStoreTenantLogisticsDeliveryOption {
  type: EcoStoreTenantLogisticsDeliveryType;
  enabled: boolean; // enable or disable any access to the tenant store.
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
    slogan?: string;
    languages: string[];
    themeConfig?: unknown;
    logisticsConfig: EcoStoreTenantLogistics;
    active?: boolean; // closing at superuser level.
    closed?: boolean; // closing at tenant level.
    closedReason?: LocalizedFields<string> | null; // closed by tenant reason.
  };

export type EcoStoreTenantAddress = Pick<
  BasePocketBaseEntity,
  'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'
> &
  UserContact & {
    tenant: EcoStoreTenant['id'];
    slots: Record<SlotDays, TimeRange[]>;
  };

/*
- OPEN - currently open.
- CLOSED - currently closed. Means it is closed because the tenant window is just open some days in a week or some hours in a day but open in the future.
- OPENING_SOON - currently closed, but it will open soon. Just an intermediate state between CLOSED and OPEN to allow to make UI styling and message different.
- CLOSED_MANUALLY - currently closed by the tenant, and it can have a message for the reasons.
- CANCELLED - currently closed by the superuser.
*/
export type EcoStoreTenantWindowStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'OPENING_SOON'
  | 'CLOSING_SOON'
  | 'CLOSED_MANUALLY'
  | 'CANCELLED';
