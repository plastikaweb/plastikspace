import { inject, Injectable } from '@angular/core';
import { PocketBaseGetService } from '@plastik/core/api-pocketbase';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

@Injectable()
export abstract class EcoStoreGetService<
  T extends BasePocketBaseEntity = BasePocketBaseEntity,
> extends PocketBaseGetService<T> {
  protected tenantStore = inject(ecoStoreTenantStore);

  abstract get filter(): string;
}
