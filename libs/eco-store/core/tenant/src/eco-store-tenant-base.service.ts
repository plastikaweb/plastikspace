import { inject, signal, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
      const record = await this.pb
        .collection('tenants')
        .getFirstListItem(`normalizedName="${slug}"`);

      this.tenant.set(record as EcoStoreTenant);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`❌ Tenant '${slug}' not found.`, error);
    }
  }
}
