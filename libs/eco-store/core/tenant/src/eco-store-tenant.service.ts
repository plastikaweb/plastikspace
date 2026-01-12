import { Injectable } from '@angular/core';
import { EcoStoreTenantBaseService } from './eco-store-tenant-base.service';

@Injectable({ providedIn: 'root' })
export class EcoStoreTenantService extends EcoStoreTenantBaseService {
  protected resolveSlug(): string | null {
    const hostname = this.document.location.hostname;

    const parts = hostname.split('.');

    if (parts[0] !== 'www' && parts[0] !== 'admin') {
      return parts[0];
    }

    return null;
  }
}
