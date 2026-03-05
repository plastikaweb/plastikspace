import { inject } from '@angular/core';
import { PocketBaseCrudService } from '@plastik/core/api-pocketbase';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { RecordOptions } from 'pocketbase';
import { Observable } from 'rxjs';

export abstract class EcoStoreCrudService<
  T extends BasePocketBaseEntity = BasePocketBaseEntity,
> extends PocketBaseCrudService<T> {
  protected tenantStore = inject(ecoStoreTenantStore);

  override create(data: Partial<T>, options?: RecordOptions): Observable<T> {
    return super.create(this.addTenantToCrudData(data), options);
  }

  override update(id: string, data: Partial<T>, options?: RecordOptions): Observable<T> {
    return super.update(id, this.addTenantToCrudData(data), options);
  }

  private addTenantToCrudData(data: Partial<T>): T {
    const tenantId = this.tenantStore.tenant()?.id;
    const dataWithTenant = tenantId ? { ...data, tenant: tenantId } : data;
    return dataWithTenant as T;
  }
}
