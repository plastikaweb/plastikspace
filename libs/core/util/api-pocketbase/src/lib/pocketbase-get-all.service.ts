import { DataGetList } from '@plastik/core/api-base';
import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { ListResult, RecordFullListOptions, RecordListOptions } from 'pocketbase';
import { Observable } from 'rxjs';
import { PocketBaseBaseService } from './pocketbase-base.service';

/**
 * @description Abstract class to inherit from on creating a feature PocketBase service for getting all records.
 * Provides list operations for PocketBase collections using composition.
 * @template T - The entity type that extends BasePocketBaseEntity
 */
export abstract class PocketBaseGetAllService<T extends BasePocketBaseEntity = BasePocketBaseEntity>
  extends PocketBaseBaseService<T>
  implements DataGetList<T, ListResult<T>, RecordListOptions>
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
}
