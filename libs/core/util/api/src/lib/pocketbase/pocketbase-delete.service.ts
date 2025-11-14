import { IdType } from '@plastik/core/entities';
import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { Observable } from 'rxjs';
import { PocketBaseBaseService } from './pocketbase-base.service';
import { IPocketBaseDelete } from './pocketbase.types';

/**
 * @description Abstract class to inherit from on creating a feature PocketBase service for deleting records.
 * Provides delete operations for PocketBase collections using composition.
 */
export abstract class PocketBaseDeleteService<T extends BasePocketBaseEntity = BasePocketBaseEntity>
  extends PocketBaseBaseService<T>
  implements IPocketBaseDelete
{
  /**
   * @param { string } id The record ID.
   * @returns { Observable<boolean> } The deletion result.
   * @description Delete a record.
   */
  delete(id: IdType<T>): Observable<boolean> {
    return this.createPocketCrudService().delete(id);
  }
}
