import { inject, Injector, runInInjectionContext } from '@angular/core';
import { BaseDataService } from '@plastik/core/api-base';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { ClientResponseError } from 'pocketbase';
import { Observable } from 'rxjs';
import { PocketBaseCrudService } from './pocketbase-crud.service';

/**
 * @description Abstract class to inherit from on creating a feature PocketBase service.
 * Provides all CRUD operations for PocketBase collections.
 * @template T - The entity type that extends BasePocketBaseEntity
 */
export abstract class PocketBaseBaseService<
  T extends BasePocketBaseEntity = BasePocketBaseEntity,
> extends BaseDataService {
  override readonly environment = inject(POCKETBASE_ENVIRONMENT);
  private readonly injector = inject(Injector);

  /**
   * @description Implement this method in child classes to have the collection name.
   * @returns {string} The collection name.
   */
  protected abstract collectionName(): string;

  /**
   * @description Creates a PocketBase service instance with the correct collection name.
   * @returns {PocketBaseBaseService<T>} The service instance.
   * @private
   */
  protected createPocketCrudService(): PocketBaseCrudService<T> {
    const collectionName = this.collectionName();
    const env = this.environment;
    return runInInjectionContext(this.injector, () => {
      return new (class extends PocketBaseCrudService<T> {
        override readonly environment = env;
        protected override collectionName(): string {
          return collectionName;
        }
      })();
    });
  }

  public override handleError<E = ClientResponseError>(error: E): Observable<never> {
    return super.handleError(error);
  }
}
