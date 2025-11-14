import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { RecordOptions } from 'pocketbase';
import { Observable } from 'rxjs';
import { PocketBaseBaseService } from './pocketbase-base.service';
import { IPocketBaseUpdate } from './pocketbase.types';

/**
 * @description Abstract class to inherit from on creating a feature PocketBase service for updating records.
 * Provides update operations for PocketBase collections using composition.
 * @template T - The entity type that extends BasePocketBaseEntity
 */
export abstract class PocketBaseUpdateService<T extends BasePocketBaseEntity = BasePocketBaseEntity>
  extends PocketBaseBaseService<T>
  implements IPocketBaseUpdate<T>
{
  /**
   * @param { string } id The record ID.
   * @param { Partial<T> } data The record data.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The updated record.
   * @description Update an existing record.
   */
  update(id: string, data: Partial<T>, options?: RecordOptions): Observable<T> {
    return this.createPocketCrudService().update(id, data, options);
  }
}
