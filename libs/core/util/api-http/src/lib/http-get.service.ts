import { Params } from '@angular/router';
import { DataGet } from '@plastik/core/api-base';
import { BaseEntity, IdType } from '@plastik/core/entities';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';

/**
 * @description Abstract class to inherit from on creating a feature HTTP service for getting all records.
 * Defines the shape of the service and implements reusable methods for handling HTTP GET requests.
 * @template T - The result structure type
 * @template TList - The list result structure type
 * @template PARAMS - The parameters type for the API call (extends Params)
 */
export abstract class HttpGetService<T extends BaseEntity, TList, PARAMS extends Params>
  extends HttpBaseService
  implements DataGet<T, TList, PARAMS>
{
  /**
   * @description A GET method to retrieve a list of data.
   * @template T
   * @param { PARAMS } params  The http params to pass with the API call.
   * @returns { Observable<TList | never> } The API data response after mapping or an error catch.
   */
  getList(params?: PARAMS): Observable<TList> {
    const service = this.createHttpCrudService<T, TList, PARAMS>();
    return service.getList(params);
  }

  /**
   * @description A GET method to retrieve a single record by ID.
   * @template T
   * @param {IdType<T>} id - The record ID.
   * @param {unknown} options - Optional configuration for the request.
   * @returns {Observable<T | never>} The API data response after mapping or an error catch.
   */
  getOne(id: IdType<T>, options?: unknown): Observable<T> {
    const service = this.createHttpCrudService<T, TList, PARAMS>();
    return service.getOne(id, options);
  }
}
