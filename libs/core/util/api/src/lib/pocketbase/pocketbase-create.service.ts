import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { RecordOptions } from 'pocketbase';
import { Observable } from 'rxjs';
import { PocketBaseBaseService } from './pocketbase-base.service';
import { IPocketBaseCreate } from './pocketbase.types';

/**
 * @description Abstract class to inherit from on creating a feature PocketBase service for creating records.
 * Provides create operations for PocketBase collections using composition.
 * @template T - The entity type that extends BasePocketBaseEntity
 */
export abstract class PocketBaseCreateService<T extends BasePocketBaseEntity = BasePocketBaseEntity>
  extends PocketBaseBaseService<T>
  implements IPocketBaseCreate<T>
{
  /**
   * @param { Partial<T> } data The record data.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The created record.
   * @description Create a new record.
   */
  create(data: Partial<T>, options?: RecordOptions): Observable<T> {
    return this.createPocketCrudService().create(data, options);
  }
}
