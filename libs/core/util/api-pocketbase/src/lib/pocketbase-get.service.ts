import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { ListResult, RecordFullListOptions, RecordListOptions, RecordOptions } from 'pocketbase';
import { Observable } from 'rxjs';
import { PocketBaseBaseService } from './pocketbase-base.service';
import { DataGet } from '@plastik/core/api-base';
import { IdType } from '@plastik/core/entities';

/**
 * @description Abstract class to inherit from on creating a feature PocketBase service for getting all records.
 * Provides list operations for PocketBase collections using composition.
 * @template T - The entity type that extends BasePocketBaseEntity
 */
export abstract class PocketBaseGetService<T extends BasePocketBaseEntity = BasePocketBaseEntity>
  extends PocketBaseBaseService<T>
  implements DataGet<T, ListResult<T>, RecordListOptions>
{
  /**
   * @param { PARAMS } params The list parameters.
   * @returns { Observable<RESULT> } The list of records.
   * @description Get a list of records.
   */
  getList(params: RecordListOptions = {}): Observable<ListResult<T>> {
    return this.createPocketCrudService().getList(params);
  }

  /**
   * @param { PARAMS } params The full list parameters.
   * @returns { Observable<T[]> } The full list of records.
   * @description Get all records (max 500 by default).
   */
  getFullList(params: RecordFullListOptions = {}): Observable<T[]> {
    return this.createPocketCrudService().getFullList(params);
  }

  /**
   * @param { string } id The record ID.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The single record.
   * @description Get a single record by ID.
   */
  getOne(id: IdType<T>, options?: RecordOptions): Observable<T> {
    return this.createPocketCrudService().getOne(id, options);
  }
}
