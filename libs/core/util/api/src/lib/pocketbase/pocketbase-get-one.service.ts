import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { RecordOptions } from 'pocketbase';
import { Observable } from 'rxjs';
import { PocketBaseBaseService } from './pocketbase-base.service';
import { IPocketBaseGetOne } from './pocketbase.types';

/**
 * @description Abstract class to inherit from on creating a feature PocketBase service for getting single records.
 * Provides get operations for PocketBase collections using composition.
 * @template T - The entity type that extends BasePocketBaseEntity
 */
export abstract class PocketBaseGetOneService<T extends BasePocketBaseEntity = BasePocketBaseEntity>
  extends PocketBaseBaseService<T>
  implements IPocketBaseGetOne<T>
{
  /**
   * @param { string } id The record ID.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The single record.
   * @description Get a single record by ID.
   */
  getOne(id: string, options?: RecordOptions): Observable<T> {
    return this.createPocketCrudService().getOne(id, options);
  }

  /**
   * @param { string } filter The filter.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The first record matching the filter.
   * @description Get the first record matching the filter.
   */
  getFirstListItem(filter: string, options?: RecordOptions): Observable<T> {
    return this.createPocketCrudService().getFirstListItem(filter, options);
  }
}
