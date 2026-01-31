import { signal } from '@angular/core';

export const ecoStoreTenantStoreMock = {
  loaded: signal(true),
  tenant: signal({
    name: 'tenant',
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
  getTenantLegalAddress: jest.fn().mockReturnValue({}),
  getTenantDeliveryOptionSlotsDays: jest.fn().mockReturnValue([]),
  getTenantDeliveryOptionSlotsTimes: jest.fn().mockReturnValue([]),
  getTenantDeliveryOptionCost: jest.fn().mockReturnValue(0),
  getTenantDeliveryPriceForFreeShipping: jest.fn().mockReturnValue(0),
  getTenantDeliveryPriceTiers: jest.fn().mockReturnValue([]),
  getTenantAddressesContacts: jest.fn().mockReturnValue([]),
};
