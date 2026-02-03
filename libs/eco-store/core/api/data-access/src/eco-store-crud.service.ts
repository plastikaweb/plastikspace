import { inject } from '@angular/core';
import { PocketBaseCrudService } from '@plastik/core/api-pocketbase';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

export abstract class EcoStoreCrudService<
  T extends BasePocketBaseEntity = BasePocketBaseEntity,
> extends PocketBaseCrudService<T> {
  protected tenantStore = inject(ecoStoreTenantStore);
}
