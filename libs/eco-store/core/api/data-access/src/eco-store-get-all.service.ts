import { inject } from '@angular/core';
import { PocketBaseGetAllService } from '@plastik/core/api-pocketbase';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

export abstract class EcoStoreGetAllService<
  T extends BasePocketBaseEntity = BasePocketBaseEntity,
> extends PocketBaseGetAllService<T> {
  protected tenantStore = inject(ecoStoreTenantStore);

  abstract get filter(): string;
}
