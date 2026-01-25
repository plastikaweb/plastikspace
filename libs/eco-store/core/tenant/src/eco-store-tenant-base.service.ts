import { DOCUMENT } from '@angular/common';
import { computed, inject, signal } from '@angular/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { EcoStoreTenant } from '@plastik/eco-store/entities';

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
      throw new Error(`❌ Tenant '${slug}' not found or inactive: ${error}`);
    }
  }
}
