import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { isString, TranslateService } from '@ngx-translate/core';
import { FormSelectOption, LocalizedFields, UserContact } from '@plastik/core/entities';
import {
  EcoStoreTenant,
  EcoStoreTenantAddress,
  EcoStoreTenantLogisticsDeliveryOption,
  EcoStoreTenantLogisticsDeliveryType,
  SlotDays,
  TimeRange,
} from '@plastik/eco-store/entities';
import { isEmpty, isNil } from '@plastik/shared/objects';
import { lastValueFrom } from 'rxjs';
import { EcoStoreTenantAddressService } from './eco-store-tenant-address.service';
import { EcoStoreTenantBaseService } from './eco-store-tenant-base.service';

export interface EcoStoreTenantState {
  tenant: EcoStoreTenant | null;
  loaded: boolean;
  addresses: EcoStoreTenantAddress[];
  addressesLoaded: boolean;
}

export const ecoStoreTenantStore = signalStore(
  { providedIn: 'root' },
  withDevtools('tenant'),
  withState<EcoStoreTenantState>({
    tenant: null,
    loaded: false,
    addresses: [],
    addressesLoaded: false,
  }),
  withProps(() => ({
    _tenantAddressService: inject(EcoStoreTenantAddressService),
    _tenantService: inject(EcoStoreTenantBaseService),
    _translateService: inject(TranslateService),
  })),
  withComputed(store => ({
    getTenantLegalAddress: computed(() => {
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
    getTenantAddressesContacts: computed(
      () =>
        store
          .addresses()
          .map(address => ({
            id: address.id,
            name: address.name,
            address: address.address,
            zip: address.zip,
            city: address.city,
            province: address.province,
            country: address.country,
            phone: address.phone,
            default: address.default,
          }))
          .sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)) as UserContact[]
    ),
    /**
     * Checks if shipping is fully available based on tenant configuration.
     * Returns true if at least one enabled shipping method (pickup or delivery) is properly configured:
     * - For pickup (if enabled): At least one tenant address with slots/instructions OR global pickup slots/instructions
     * - For delivery (if enabled): Delivery must have slots configured (slots are required for delivery scheduling)
     * Note: Tenant can have only pickup, only delivery, or both. Missing method is not an error.
     */
    isShippingAvailable: computed(() => {
      const currentTenant = store.tenant();
      if (!currentTenant?.logisticsConfig) return false;

      const { options } = currentTenant.logisticsConfig;
      if (!options || options.length === 0) return false;

      const enabledOptions = options.filter(opt => opt.enabled);
      if (enabledOptions.length === 0) return false;

      const configuredMethods: boolean[] = [];

      const pickupOption = options.find(opt => opt.type === 'pickup' && opt.enabled);
      if (pickupOption) {
        const addresses = store.addresses();
        const hasGlobalPickupConfig =
          (pickupOption.slots && Object.keys(pickupOption.slots).length > 0) ||
          !!pickupOption.instructions;

        const hasAddressConfig =
          addresses?.some(address => {
            const hasSlots = address.slots && Object.keys(address.slots).length > 0;
            const hasInstructions = !!address.instructions;
            return hasSlots || hasInstructions;
          }) ?? false;

        const isPickupConfigured = hasGlobalPickupConfig || hasAddressConfig;
        configuredMethods.push(isPickupConfigured);
      }

      const deliveryOption = options.find(opt => opt.type === 'delivery' && opt.enabled);
      if (deliveryOption) {
        const isDeliveryConfigured =
          deliveryOption.slots && Object.keys(deliveryOption.slots).length > 0;
        if (isDeliveryConfigured) {
          configuredMethods.push(isDeliveryConfigured);
        }
      }

      return configuredMethods.some(configured => configured);
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
      if (!tenant) {
        return null;
      }
      return tenant.logisticsConfig?.options?.find(option => option.type === type) || null;
    },

    _getDeliverySlotsRecord(): Record<SlotDays, TimeRange[]> | null {
      return this.getTenantDeliveryOption('delivery')?.slots || null;
    },

    _getPickupSlotsRecord(addressId: string | null): Record<SlotDays, TimeRange[]> | null {
      let addressSlots = store.addresses().find(address => address.id === addressId)?.slots || null;

      if (isEmpty(addressSlots) || isNil(addressSlots)) {
        addressSlots =
          store.tenant()?.logisticsConfig?.options?.find(option => option.type === 'pickup')
            ?.slots || null;
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
        isString(instructions)
          ? instructions
          : store._translateService.instant(instructions[currentLanguage] || '');

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

      if (type === 'delivery') {
        // Check if tiers exist in tenant
        if (deliveryOption?.slots && Object.keys(deliveryOption.slots).length > 0) {
          return {
            slots: deliveryOption.slots,
            type: 'slots',
          };
        }
        if (deliveryOption.instructions) {
          return {
            instructions: this.getTenantDeliveryInstructions(type, addressId),
            type: 'instructions',
          };
        }
        return null;
      }

      if (type === 'pickup') {
        const address = store.addresses().find(address => address.id === addressId);

        if (address?.slots && Object.keys(address.slots).length > 0) {
          return {
            slots: address.slots,
            type: 'slots',
          };
        }

        if (deliveryOption?.slots && Object.keys(deliveryOption.slots).length > 0) {
          return {
            slots: deliveryOption.slots,
            type: 'slots',
          };
        }

        if (address?.instructions) {
          return {
            instructions: this.getTenantDeliveryInstructions(type, addressId),
            type: 'instructions',
          };
        }

        if (deliveryOption.instructions) {
          return {
            instructions: this.getTenantDeliveryInstructions(type, addressId),
            type: 'instructions',
          };
        }

        return null;
      }

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
      if (!tenant?.logisticsConfig?.options) return [];

      const availableMethods: EcoStoreTenantLogisticsDeliveryType[] = [];

      const pickupOption = tenant.logisticsConfig.options.find(opt => opt.type === 'pickup');
      if (pickupOption?.enabled) {
        const hasGlobalPickupConfig =
          (pickupOption.slots && Object.keys(pickupOption.slots).length > 0) ||
          !!pickupOption.instructions;

        const hasAddressConfig = store.addresses().some(address => {
          const hasSlots = address.slots && Object.keys(address.slots).length > 0;
          const hasInstructions = !!address.instructions;
          return hasSlots || hasInstructions;
        });

        if (hasGlobalPickupConfig || hasAddressConfig) {
          availableMethods.push('pickup');
        }
      }

      const deliveryOption = tenant.logisticsConfig.options.find(opt => opt.type === 'delivery');
      if (deliveryOption?.enabled) {
        const hasDeliverySlots =
          deliveryOption.slots && Object.keys(deliveryOption.slots).length > 0;
        if (hasDeliverySlots) {
          availableMethods.push('delivery');
        }
      }

      return availableMethods;
    },
  }))
);
