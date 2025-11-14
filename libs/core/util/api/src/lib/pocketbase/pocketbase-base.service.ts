import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { ClientResponseError } from 'pocketbase';
import { Observable } from 'rxjs';
import { BaseDataService } from '../base-data.service';
import { PocketBaseCrudService } from './pocketbase-crud.service';

/**
 * @description Abstract class to inherit from on creating a feature PocketBase service.
 * Provides all CRUD operations for PocketBase collections.
 * @template T - The entity type that extends BasePocketBaseEntity
 */
export abstract class PocketBaseBaseService<
  T extends BasePocketBaseEntity = BasePocketBaseEntity,
> extends BaseDataService {
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
    return new (class extends PocketBaseCrudService<T> {
      protected override collectionName(): string {
        return collectionName;
      }
    })();
  }

  public override handleError<E = ClientResponseError>(error: E): Observable<never> {
    return super.handleError(error);
  }
}
