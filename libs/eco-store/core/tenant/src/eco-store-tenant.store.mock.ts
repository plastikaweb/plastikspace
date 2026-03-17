import { signal } from '@angular/core';

export const mockEcoStoreTenantStore = {
  loaded: signal(true),
  tenant: signal({
    name: 'tenant',
    id: 'tenant',
    slogan: 'slogan',
    logo: 'logo',
    logisticsConfig: {
      options: [
        {
          type: 'pickup',
          instructions: 'Pickup instructions',
          cost: 0,
          tiers: [],
        },
      ],
    },
  }),
  tenantLegalAddress: vi.fn().mockReturnValue({}),
  tenantAddressesContacts: vi.fn().mockReturnValue([]),
  isStoreOpen: vi.fn().mockReturnValue(true),
  storeStatus: vi.fn().mockReturnValue('OPEN'),
  nextOpenDate: vi.fn().mockReturnValue(new Date()),
  is24h: vi.fn().mockReturnValue(false),
  isShippingAvailable: vi.fn().mockReturnValue(true),
  getTenantDeliveryOptionSlotsDays: vi.fn().mockReturnValue([]),
  getTenantDeliveryOptionSlotsTimes: vi.fn().mockReturnValue([]),
  getTenantDeliveryOptionCost: vi.fn().mockReturnValue(0),
  getTenantDeliveryPriceForFreeShipping: vi.fn().mockReturnValue(0),
  getTenantDeliveryPriceTiers: vi.fn().mockReturnValue([]),
  getTenantAvailableShippingMethods: vi.fn().mockReturnValue([]),
  getTiersOrInstructions: vi.fn().mockReturnValue(null),
  closedReasonTranslated: signal(null),
  tenantDescriptionTranslated: signal(null),
};
