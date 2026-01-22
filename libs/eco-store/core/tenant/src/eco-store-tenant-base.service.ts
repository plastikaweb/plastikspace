import { DOCUMENT } from '@angular/common';
import { computed, inject, signal } from '@angular/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { FormSelectOption, UserContact } from '@plastik/core/entities';
import {
  EcoStoreTenant,
  EcoStoreTenantLogisticsDeliveryOption,
  EcoStoreTenantLogisticsDeliveryType,
  SlotDays,
} from '@plastik/eco-store/entities';
import { isNil } from '@plastik/shared/objects';

/**
 * Abstract base service for tenant resolution.
 */
export abstract class EcoStoreTenantBaseService {
  protected document = inject(DOCUMENT);
  protected pb = inject(POCKETBASE_INSTANCE);

  readonly tenant = signal<EcoStoreTenant | null>(null);
  readonly isTenantLoaded = computed(() => !!this.tenant());

  protected abstract resolveSlug(): string | null;

  async loadTenant(): Promise<void> {
    const slug = await this.resolveSlug();

    if (!slug) {
      // eslint-disable-next-line no-console
      console.log('No tenant found. Global navigation.');
      return;
    }

    try {
      const tenant = (await this.pb
        .collection('tenants')
        .getFirstListItem(`normalizedName="${slug}"`)) as EcoStoreTenant;

      if (!tenant.active) {
        throw new Error('Tenant is inactive');
      }

      this.tenant.set(tenant);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`❌ Tenant '${slug}' not found or inactive.`, error);
    }
  }

  getTenantAddress(): UserContact {
    const tenant = this.tenant();
    if (!tenant) {
      return {} as UserContact;
    }
    return {
      id: tenant.id ?? '',
      name: tenant.name ?? '',
      address: tenant.address ?? '',
      city: tenant.city,
      zip: tenant.zip,
      province: tenant.province,
      country: tenant.country,
      phone: tenant.phone,
    };
  }

  getTenantDeliveryOption(
    type: EcoStoreTenantLogisticsDeliveryType
  ): EcoStoreTenantLogisticsDeliveryOption | null {
    const tenant = this.tenant();
    if (!tenant) {
      return null;
    }
    return tenant.logisticsConfig?.options?.find(option => option.type === type) || null;
  }

  getTenantDeliveryOptionSlotsDays(type: EcoStoreTenantLogisticsDeliveryType): FormSelectOption[] {
    const slots = this.getTenantDeliveryOption(type)?.slots;
    if (!slots) {
      return [];
    }
    return Object.keys(slots).map(day => ({
      label: day,
      value: day,
    }));
  }

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
  }

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
  }

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
  }
}
