import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { EcoStoreTenant } from '@plastik/eco-store/entities';

/**
 * Abstract base service for tenant resolution.
 */
export abstract class EcoStoreTenantBaseService {
  protected document = inject(DOCUMENT);
  protected pb = inject(POCKETBASE_INSTANCE);
  protected platformId = inject(PLATFORM_ID);

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

    const cacheKey = `eco-store-tenant-${slug}`;
    let cachedData: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      cachedData = localStorage.getItem(cacheKey);
    }

    if (cachedData) {
      try {
        const tenant = JSON.parse(cachedData) as EcoStoreTenant;
        this.tenant.set(tenant);
        // Refresh in background without awaiting
        this.fetchTenant(slug, cacheKey);
        return;
      } catch {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem(cacheKey);
        }
      }
    }

    await this.fetchTenant(slug, cacheKey);
  }

  private async fetchTenant(slug: string, cacheKey: string): Promise<void> {
    try {
      const tenant = (await this.pb
        .collection('tenants')
        .getFirstListItem(`normalizedName="${slug}"`)) as EcoStoreTenant;

      if (!tenant.active) {
        throw new Error('Tenant is inactive');
      }
      this.tenant.set(tenant);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(cacheKey, JSON.stringify(tenant));
      }
    } catch (error) {
      if (!this.tenant()) {
        throw new Error(`❌ Tenant '${slug}' not found or inactive: ${error}`);
      }
    }
  }
}
