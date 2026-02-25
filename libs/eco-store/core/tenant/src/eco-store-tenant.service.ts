import { Injectable } from '@angular/core';
import { EcoStoreTenantBaseService } from './eco-store-tenant-base.service';

@Injectable()
export class EcoStoreTenantService extends EcoStoreTenantBaseService {
  protected resolveSlug(): string | null {
    const hostname = this.document.location.hostname;
    const SKIP_PREFIXES = ['www', 'admin'];
    const parts = hostname.split('.');

    const slug = SKIP_PREFIXES.includes(parts[0]) ? parts[1] : parts[0];
    return slug ?? null;
  }
}
