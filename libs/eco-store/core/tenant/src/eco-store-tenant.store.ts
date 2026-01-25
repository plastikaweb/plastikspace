import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  EcoStoreTenant,
  EcoStoreTenantLogisticsDeliveryOption,
  EcoStoreTenantLogisticsDeliveryType,
  SlotDays,
} from '@plastik/eco-store/entities';
import { FormSelectOption, UserContact } from '@plastik/core/entities';
import { isNil } from '@plastik/shared/objects';
import { EcoStoreTenantBaseService } from './eco-store-tenant-base.service';

export interface EcoStoreTenantState {
  tenant: EcoStoreTenant | null;
  loaded: boolean;
  addresses: UserContact[];
}

export const ecoStoreTenantStore = signalStore(
  { providedIn: 'root' },
  withDevtools('tenant'),
  withState<EcoStoreTenantState>({
    tenant: null,
    loaded: false,
    addresses: [],
  }),
  withProps(() => ({
    _tenantService: inject(EcoStoreTenantBaseService),
  })),
  withComputed(({ tenant }) => ({
    getTenantAddress: computed(() => {
      const currentTenant = tenant();
      if (!currentTenant) {
        return {} as UserContact;
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
    getTenantDeliveryOption(
      type: EcoStoreTenantLogisticsDeliveryType
    ): EcoStoreTenantLogisticsDeliveryOption | null {
      const tenant = store.tenant();
      if (!tenant) {
        return null;
      }
      return tenant.logisticsConfig?.options?.find(option => option.type === type) || null;
    },

    getTenantDeliveryOptionSlotsDays(
      type: EcoStoreTenantLogisticsDeliveryType
    ): FormSelectOption[] {
      const slots = this.getTenantDeliveryOption(type)?.slots;
      if (!slots) {
        return [];
      }
      return Object.keys(slots).map(day => ({
        label: day,
        value: day,
      }));
    },

    getTenantDeliveryOptionSlotsTimes(
      type: EcoStoreTenantLogisticsDeliveryType,
      day: SlotDays
    ): FormSelectOption[] {
      const slots = this.getTenantDeliveryOption(type)?.slots?.[day];
      if (!slots) {
        return [];
      }
      return slots.map(slot => ({
        label: slot,
        value: slot,
      }));
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
