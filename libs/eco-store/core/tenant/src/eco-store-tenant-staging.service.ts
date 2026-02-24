import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { EcoStoreTenantBaseService } from './eco-store-tenant-base.service';

@Injectable()
export class EcoStoreTenantStagingService extends EcoStoreTenantBaseService {
  private readonly STORAGE_KEY = 'staging_tenant_key';

  protected resolveSlug(): string | null {
    if (this.document.location?.search) {
      const urlParams = new URLSearchParams(this.document.location.search);
      const queryTenant = urlParams.get('tenant');

      if (queryTenant) {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem(this.STORAGE_KEY, queryTenant);
        }
        urlParams.delete('tenant');

        const newQueryString = urlParams.toString();
        const newPath =
          this.document.location.pathname + (newQueryString ? '?' + newQueryString : '');

        if (isPlatformBrowser(this.platformId)) {
          window.history.replaceState({}, '', newPath);
        }

        return queryTenant;
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      const storedTenant = sessionStorage.getItem(this.STORAGE_KEY);
      if (storedTenant) {
        return storedTenant;
      }
    }

    return null;
  }
}
