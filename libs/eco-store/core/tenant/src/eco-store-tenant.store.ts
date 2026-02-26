import { updateState, withDevtools, withImmutableState } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { FormSelectOption, LocalizedFields } from '@plastik/core/entities';
import {
  DAYS_MAP,
  EcoStoreTenant,
  EcoStoreTenantAddress,
  EcoStoreTenantLogisticsDeliveryOption,
  EcoStoreTenantLogisticsDeliveryType,
  SlotDays,
  TimeRange,
} from '@plastik/eco-store/entities';
import { CountdownService } from '@plastik/shared/countdown/util';
import { isEmpty, isNil } from '@plastik/shared/objects';
import { lastValueFrom, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { EcoStoreTenantAddressService } from './eco-store-tenant-address.service';
import { EcoStoreTenantBaseService } from './eco-store-tenant-base.service';
import {
  calculateStoreWindowStatus,
  formatTenantAddresses,
  getNextDateFromTime,
  isShippingMethodConfigured,
} from './eco-store-tenant.utils';

export interface EcoStoreTenantState {
  tenant: EcoStoreTenant | null;
  loaded: boolean;
  addresses: EcoStoreTenantAddress[];
  addressesLoaded: boolean;
}

export const ecoStoreTenantStore = signalStore(
  { providedIn: 'root' },
  withDevtools('tenant'),
  withImmutableState<EcoStoreTenantState>({
    tenant: null,
    loaded: false,
    addresses: [],
    addressesLoaded: false,
  }),
  withProps(() => ({
    _tenantAddressService: inject(EcoStoreTenantAddressService),
    _tenantService: inject(EcoStoreTenantBaseService),
    _translateService: inject(TranslateService),
    _countdownService: inject(CountdownService),
  })),
  withComputed(store => {
    const nowSignal = toSignal(timer(0, 1000).pipe(map(() => new Date())), {
      initialValue: new Date(),
    });

    return {
      _now: nowSignal,
      closedReasonTranslated: computed(() => {
        const currentTenant = store.tenant();
        if (!currentTenant) {
          return null;
        }

        const { closedReason, closed } = currentTenant;

        if (!closed) {
          return null;
        }

        const currentLanguage = store._translateService.getCurrentLang();
        return closedReason?.[currentLanguage] || null;
      }),

      tenantLegalAddress: computed(() => {
        const currentTenant = store.tenant();
        if (!currentTenant) {
          return {} as EcoStoreTenantAddress;
        }

        const { id, name, address, city, zip, province, country, phone } = currentTenant;
        return {
          id,
          name,
          address,
          city,
          zip,
          province,
          country,
          phone,
        };
      }),

      is24h: computed(() => !store.tenant()?.logisticsConfig?.orderWindow?.enabled),

      tenantAddressesContacts: computed(() => formatTenantAddresses(store.addresses())),
    };
  }),
  withComputed(store => ({
    storeStatus: computed(() => {
      const tenant = store.tenant();
      const now = store._now();

      return calculateStoreWindowStatus(
        now,
        !!tenant?.logisticsConfig?.orderWindow?.enabled,
        tenant?.logisticsConfig?.orderWindow?.openDay,
        tenant?.logisticsConfig?.orderWindow?.openTime,
        tenant?.logisticsConfig?.orderWindow?.closeDay,
        tenant?.logisticsConfig?.orderWindow?.closeTime,
        tenant?.active,
        tenant?.closed
      );
    }),
  })),
  withComputed(store => ({
    nextOpenDate: computed(() => {
      const tenant = store.tenant();
      const now = store._now();
      const status = store.storeStatus();

      if (!tenant?.logisticsConfig?.orderWindow?.enabled) {
        return null;
      }

      const { openDay, openTime, closeDay, closeTime } = tenant.logisticsConfig.orderWindow;

      if (status === 'CLOSING_SOON') {
        return closeDay && closeTime
          ? getNextDateFromTime(now, DAYS_MAP[closeDay], closeTime)
          : null;
      }

      if (!openDay || !openTime) return null;

      return getNextDateFromTime(now, DAYS_MAP[openDay], openTime);
    }),

    isStoreOpen: computed(() => {
      const status = store.storeStatus();
      return status === 'OPEN' || status === 'CLOSING_SOON';
    }),
  })),
  withComputed(store => ({
    _nextOpenCountdown: computed(() => {
      return store._countdownService.createCountdown(() => store.nextOpenDate());
    }),
  })),
  withComputed(store => ({
    nextOpenCountdownSegments: computed(() => {
      const text = store._nextOpenCountdown().text();
      return text
        ? text
            .split(/(:)/)
            .filter(Boolean)
            .map(segment => segment.trim())
        : [];
    }),
  })),
  withComputed(store => ({
    /**
     * Checks if shipping is fully available based on tenant configuration.
     * Respects the 'closed' manual override flag on each delivery option.
     */
    isShippingAvailable: computed(() => {
      const currentTenant = store.tenant();
      const options = currentTenant?.logisticsConfig?.options;
      if (!options) return false;

      return ['pickup' as const, 'delivery' as const].some(type =>
        isShippingMethodConfigured(type, options, store.addresses())
      );
    }),
  })),
  withMethods(store => ({
    async getTenant() {
      updateState(store, `[tenant] get tenant in process`, { loaded: false });

      try {
        await store._tenantService.loadTenant();
        updateState(store, `[tenant] get tenant success`, {
          tenant: store._tenantService.tenant(),
          loaded: true,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'eco-store.error.getTenant';
        updateState(store, `[tenant] get tenant failed ${errorMessage}`, {
          tenant: null,
          loaded: false,
        });
      }
    },

    async getTenantAddresses(): Promise<void> {
      try {
        updateState(store, `[tenant] loading addresses`, { addressesLoaded: false });

        const addresses = await lastValueFrom(
          store._tenantAddressService.getFullList({
            filter: `tenant = "${store.tenant()?.id}" && active = true`,
          })
        );

        updateState(store, `[tenant] addresses loaded`, {
          addresses: addresses || [],
          addressesLoaded: true,
          loaded: true,
        });
      } catch (error) {
        updateState(store, `[tenant] addresses load failed ${error}`, {
          addressesLoaded: false,
          loaded: false,
        });
      }
    },

    getTenantDeliveryOption(
      type: EcoStoreTenantLogisticsDeliveryType
    ): EcoStoreTenantLogisticsDeliveryOption | null {
      const tenant = store.tenant();
      if (!tenant) return null;

      const option = tenant.logisticsConfig?.options?.find(option => option.type === type);
      return option?.enabled ? option : null;
    },

    _getDeliverySlotsRecord(): Record<SlotDays, TimeRange[]> | null {
      return this.getTenantDeliveryOption('delivery')?.slots || null;
    },

    _getPickupSlotsRecord(addressId: string | null): Record<SlotDays, TimeRange[]> | null {
      const pickupOption = store
        .tenant()
        ?.logisticsConfig?.options?.find(
          (option: EcoStoreTenantLogisticsDeliveryOption) => option.type === 'pickup'
        );
      if (!pickupOption?.enabled) return null;

      let addressSlots = store.addresses().find(address => address.id === addressId)?.slots || null;

      if (isEmpty(addressSlots) || isNil(addressSlots)) {
        addressSlots = pickupOption.slots || null;
      }
      return addressSlots;
    },

    getTenantDeliveryOptionSlotsDays(
      type: EcoStoreTenantLogisticsDeliveryType,
      addressId: string | null = null
    ): FormSelectOption[] {
      const slots =
        type === 'delivery'
          ? this._getDeliverySlotsRecord()
          : this._getPickupSlotsRecord(addressId);

      return slots
        ? Object.keys(slots).map(day => ({
            label: day,
            value: day,
          }))
        : [];
    },

    getTenantDeliveryOptionSlotsTimes(
      type: EcoStoreTenantLogisticsDeliveryType,
      day: SlotDays,
      addressId: string | null = null
    ): FormSelectOption[] {
      const slots =
        type === 'delivery'
          ? this._getDeliverySlotsRecord()
          : this._getPickupSlotsRecord(addressId);

      return slots?.[day]
        ? slots[day].map(slot => ({
            label: slot,
            value: slot,
          }))
        : [];
    },

    getTenantDeliveryOptionCost(type: EcoStoreTenantLogisticsDeliveryType, amount: number): number {
      const deliveryOption = this.getTenantDeliveryOption(type);
      const cost = deliveryOption?.cost;
      const tiers = deliveryOption?.tiers;

      if (!isNil(cost) && !tiers) {
        return cost || 0;
      }
      if (tiers) {
        const applicableTier = tiers.find(tier => amount >= tier.min);
        return applicableTier?.cost || 0;
      }
      return 0;
    },

    getTenantDeliveryPriceForFreeShipping(
      type: EcoStoreTenantLogisticsDeliveryType,
      amount: number
    ): number {
      const deliveryOption = this.getTenantDeliveryOption(type);
      const tiers = deliveryOption?.tiers;

      if (tiers && tiers.length > 0) {
        const freeTier = tiers.find(tier => tier.cost === 0);

        if (freeTier) {
          const remaining = freeTier.min - amount;
          return remaining > 0 ? remaining : 0;
        }
      }

      return 0;
    },

    getTenantDeliveryPriceTiers() {
      const deliveryOption = this.getTenantDeliveryOption('delivery');
      return deliveryOption?.tiers || [];
    },

    getTenantDeliveryInstructions(
      type: EcoStoreTenantLogisticsDeliveryType = 'pickup',
      addressId: string | null = null
    ) {
      const tenant = store.tenant();
      if (!tenant) return '';

      const currentLanguage = store._translateService.getCurrentLang();
      const translateInstructions = (instructions: string | LocalizedFields<string>) =>
        typeof instructions === 'string'
          ? instructions
          : store._translateService.instant(
              (instructions as LocalizedFields<string>)[currentLanguage] || ''
            );

      if (type === 'pickup') {
        const address = store.addresses().find(address => address.id === addressId);
        const addressInstructions = address?.instructions || '';
        const tenantInstructions =
          tenant.logisticsConfig?.options?.find(option => option.type === type)?.instructions || '';

        return addressInstructions
          ? translateInstructions(addressInstructions)
          : tenantInstructions
            ? translateInstructions(tenantInstructions)
            : '';
      }

      if (type === 'delivery') {
        const instructions =
          tenant.logisticsConfig?.options?.find(option => option.type === 'delivery')
            ?.instructions || '';

        return instructions ? translateInstructions(instructions) : '';
      }
    },
    getTiersOrInstructions(
      type: EcoStoreTenantLogisticsDeliveryType = 'pickup',
      addressId: string | null = null
    ) {
      const tenant = store.tenant();
      if (!tenant) return null;

      const deliveryOption = tenant.logisticsConfig?.options?.find(option => option.type === type);
      if (!deliveryOption?.enabled) return null;

      // 1. Max priority: address specific configuration (only Pickup)
      if (type === 'pickup' && addressId) {
        const address = store.addresses().find(a => a.id === addressId);

        if (address) {
          if (address.slots && Object.keys(address.slots).length > 0) {
            return { type: 'slots', slots: address.slots };
          }
          // Ara mirem les instruccions de l'adreça ABANS de mirar els slots globals
          if (address.instructions) {
            return {
              type: 'instructions',
              instructions: this.getTenantDeliveryInstructions(type, addressId),
            };
          }
        }
      }

      // 2. Fallback: Global configuration (applicable to Delivery and Pickup without own configuration)
      if (deliveryOption.slots && Object.keys(deliveryOption.slots).length > 0) {
        return { type: 'slots', slots: deliveryOption.slots };
      }

      if (deliveryOption.instructions) {
        return {
          type: 'instructions',
          instructions: this.getTenantDeliveryInstructions(type, addressId),
        };
      }

      // 3. If nothing is configured
      return null;
    },

    /**
     * Returns only fully configured shipping methods.
     * Filters out enabled methods that lack proper configuration:
     * - Pickup: Must have slots/instructions at tenant level OR in at least one address
     * - Delivery: Must have slots configured (slots are required for delivery scheduling)
     * @returns {EcoStoreTenantLogisticsDeliveryType[]} Array of available, fully configured shipping method types
     */
    getTenantAvailableShippingMethods(): EcoStoreTenantLogisticsDeliveryType[] {
      const tenant = store.tenant();
      const options = tenant?.logisticsConfig?.options;
      if (!options) return [];

      return (['pickup', 'delivery'] as EcoStoreTenantLogisticsDeliveryType[]).filter(type =>
        isShippingMethodConfigured(type, options, store.addresses())
      );
    },
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        const tenant = store._tenantService.tenant();
        if (tenant) {
          updateState(store, '[tenant] service signal updated', {
            tenant,
            loaded: true,
          });
        }
      });
    },
  })
);
