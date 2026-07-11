import { Observable } from 'rxjs';

import { HttpBaseService } from './http-base.service';
import { DataGetOne } from '@plastik/core/api-base';
import { BaseEntity, IdType } from '@plastik/core/entities';

/**
 * @description Abstract class to inherit from on creating a feature api service.
 * @template T
 *
 * **T** refers to the main feature model item used inside applications.
 */
export abstract class HttpGetOneService<T extends BaseEntity>
  extends HttpBaseService
  implements DataGetOne<T>
{
  getOne(id: IdType<T>): Observable<T> {
    return this.createHttpCrudService<T>().getOne(id);
  }
}
