import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { FormSelectOption, UserContact } from '@plastik/core/entities';
import {
  EcoStoreTenant,
  EcoStoreTenantAddress,
  EcoStoreTenantLogisticsDeliveryOption,
  EcoStoreTenantLogisticsDeliveryType,
  SlotDays,
  TimeRange,
} from '@plastik/eco-store/entities';
import { isNil } from '@plastik/shared/objects';
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
      return store.addresses().find(address => address.id === addressId)?.slots || null;
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
  }))
);
