import { catchError, map, Observable, ReplaySubject, share, throwError, timer } from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@plastik/core/environments';

/**
 * @description Abstract class to inherit from on creating a feature api service.
 * @template T, P
 *
 * **T** refers to the main feature model item used inside applications.
 *
 * **P** refers to the type description of the passed parameters to API call methods.
 * These parameters are the usual option to pass configuration with the REST call, for example for filtering results, paginate or ordering data.
 */
@Injectable()
export abstract class ApiService<T, P extends object> {
  readonly #environment = inject(ENVIRONMENT);
  readonly #httpClient = inject(HttpClient);
  readonly #apiUrl = `${this.#environment.apiUrl}/${this.resourceUrlSegment()}`;

  /**
   * @description Implement this method in child classes to set the request cache time.
   * @returns {number} The time in milliseconds.
   */
  protected cacheTime = 1000 * 60 * 60 * 24;

  /**
   * @description Implement this method in child classes to have the feature resource URL segment name.
   * @returns {string} The resource URL segment.
   */
  protected abstract resourceUrlSegment(): string;

  /**
   * @description Method to map the API response with the inner typings before storing it in app.
   * @template T
   * Override this method in child classes when inheriting from ApiService with your custom API response structures.
   * @param { unknown } data The API response data as it is.
   * @returns { T } The mapped API response.
   */
  protected mapListResponse(data: unknown): T {
    return data as T;
  }

  /**
   * @description A GET method to retrieve a list of data.
   * @template T, P
   * @param { P } params  The http params to pass with the API call.
   * @returns { Observable<P | never> } The API data response after mapping or an error catch.
   */
  getList(params: P): Observable<T> {
    return this.#httpClient.get(this.#apiUrl, { params: this.getHttpParams(params) }).pipe(
      map(this.mapListResponse),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(this.cacheTime),
      }),
      catchError(this.handleError)
    );
  }

  private getHttpParams(params: P): HttpParams {
    let httpClientParams: HttpParams = new HttpParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      httpClientParams = httpClientParams.set(key, `${value}`);
    });

    return httpClientParams;
  }

  private handleError({ error }: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}
