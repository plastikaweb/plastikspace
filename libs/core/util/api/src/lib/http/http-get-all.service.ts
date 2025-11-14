import { catchError, map, Observable, ReplaySubject, share, timer } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { IGetAll } from '../data-crud-unified';
import { HttpBaseService } from './http-base.service';

/**
 * @description Abstract class to inherit from on creating a feature HTTP service for getting all records.
 * Defines the shape of the service and implements reusable methods for handling HTTP GET requests.
 * @template RESULT - The result structure type
 * @template PARAMS - The parameters type for the API call (extends Params)
 */
export abstract class HttpGetAllService<RESULT, PARAMS extends Params>
  extends HttpBaseService
  implements IGetAll<RESULT, PARAMS>
{
  /**
   * @description Method to map the API response with the inner typings before storing it in app.
   * @template T
   * Override this method in child classes when inheriting from ApiService with your custom API response structures.
   * @param { unknown } data The API response data as it is.
   * @returns { RESULT } The mapped API response.
   */
  protected mapListResponse(data: unknown): RESULT {
    return data as unknown as RESULT;
  }

  /**
   * @description A GET method to retrieve a list of data.
   * @template T, P
   * @param { P } params  The http params to pass with the API call.
   * @returns { Observable<P | never> } The API data response after mapping or an error catch.
   */
  getList(params?: PARAMS): Observable<RESULT> {
    return this.httpClient.get(this.apiUrl, { params: this.getHttpParams(params) }).pipe(
      map(this.mapListResponse),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(this.cacheTime),
      }),
      catchError(this.handleError)
    );
  }

  getHttpParams(params?: PARAMS): HttpParams {
    let httpClientParams: HttpParams = new HttpParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      httpClientParams = httpClientParams.set(key, `${value}`);
    });

    return httpClientParams;
  }
}
