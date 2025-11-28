import { HttpBaseService } from './http-base.service';
import { DataGetList } from '@plastik/core/api-base';
import { BaseEntity } from '@plastik/core/entities';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * @description Abstract class to inherit from on creating a feature HTTP service for getting all records.
 * Defines the shape of the service and implements reusable methods for handling HTTP GET requests.
 * @template T - The result structure type
 * @template TList - The list result structure type
 * @template PARAMS - The parameters type for the API call (extends Params)
 */
export abstract class HttpGetAllService<T extends BaseEntity, TList, PARAMS extends Params>
  extends HttpBaseService
  implements DataGetList<T, TList, PARAMS>
{
  /**
   * @description A GET method to retrieve a list of data.
   * @template T, P
   * @param { P } params  The http params to pass with the API call.
   * @returns { Observable<P | never> } The API data response after mapping or an error catch.
   */
  getList(params?: PARAMS): Observable<TList> {
    const service = this.createHttpCrudService<T, TList, PARAMS>();
    return service.getList(params);
  }
}
