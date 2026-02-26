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
  tenantLegalAddress: jest.fn().mockReturnValue({}),
  tenantAddressesContacts: jest.fn().mockReturnValue([]),
  isStoreOpen: jest.fn().mockReturnValue(true),
  storeStatus: jest.fn().mockReturnValue('OPEN'),
  nextOpenDate: jest.fn().mockReturnValue(new Date()),
  is24h: jest.fn().mockReturnValue(false),
  isShippingAvailable: jest.fn().mockReturnValue(true),
  getTenantDeliveryOptionSlotsDays: jest.fn().mockReturnValue([]),
  getTenantDeliveryOptionSlotsTimes: jest.fn().mockReturnValue([]),
  getTenantDeliveryOptionCost: jest.fn().mockReturnValue(0),
  getTenantDeliveryPriceForFreeShipping: jest.fn().mockReturnValue(0),
  getTenantDeliveryPriceTiers: jest.fn().mockReturnValue([]),
  getTenantAvailableShippingMethods: jest.fn().mockReturnValue([]),
  getTiersOrInstructions: jest.fn().mockReturnValue(null),
  closedReasonTranslated: signal(null),
};
