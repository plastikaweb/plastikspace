import { Injectable } from '@angular/core';
import { PocketBaseGetService } from '@plastik/core/api-pocketbase';
import { EcoStoreTenantAddress } from '@plastik/eco-store/entities';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreTenantAddressService extends PocketBaseGetService<EcoStoreTenantAddress> {
  protected collectionName(): string {
    return 'tenant_addresses';
  }
}
