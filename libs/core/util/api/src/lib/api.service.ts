import { catchError, map, Observable, ReplaySubject, share, timer } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseDataService } from './base-data.service';
import { DataApiService } from './data-crud';

/**
 * @description Abstract class to inherit from on creating a feature api service.
 * @template T, P, E
 *
 * **T** refers to the main feature model item used inside applications.
 *
 * **P** refers to the type description of the passed parameters to API call methods.
 * These parameters are the usual option to pass configuration with the REST call, for example for filtering results, paginate or ordering data.
 *
 * **E** refers to the environment type extension with the API URL property.
 */
@Injectable()
export abstract class ApiService<TList, P extends object, TEntity = unknown, ID = string>
  extends BaseDataService
  implements DataApiService<TEntity, TList, P, ID>
{
  readonly #httpClient = inject(HttpClient);
  readonly #apiUrl: string;

  constructor() {
    super();
    this.#apiUrl = `${this.getApiUrlFromEnvironment()}/${this.resourceUrlSegment()}`;
  }

  /**
   * @description Gets the API URL from the environment. Override if your environment uses a different property name.
   * @returns {string} The base API URL.
   */
  protected getApiUrlFromEnvironment(): string {
    return this.environment.baseApiUrl;
  }

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
  protected mapListResponse(data: unknown): TList {
    return data as unknown as TList;
  }

  /**
   * @description A GET method to retrieve a list of data.
   * @template T, P
   * @param { P } params  The http params to pass with the API call.
   * @returns { Observable<P | never> } The API data response after mapping or an error catch.
   */
  getList(params?: P): Observable<TList> {
    return this.#httpClient.get(this.#apiUrl, { params: this.getHttpParams(params) }).pipe(
      map(this.mapListResponse),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(this.cacheTime),
      }),
      catchError(this.handleError)
    );
  }

  private getHttpParams(params?: P): HttpParams {
    let httpClientParams: HttpParams = new HttpParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      httpClientParams = httpClientParams.set(key, `${value}`);
    });

    return httpClientParams;
  }

  protected mapItemResponse(data: unknown): TEntity {
    return data as TEntity;
  }

  getOne(id: ID, options?: unknown): Observable<TEntity> {
    void options;
    return this.#httpClient.get(`${this.#apiUrl}/${id}`).pipe(
      map(response => this.mapItemResponse(response)),
      catchError(this.handleError)
    );
  }

  create(data: Partial<TEntity>, options?: unknown): Observable<TEntity> {
    void options;
    return this.#httpClient.post(this.#apiUrl, data).pipe(
      map(response => this.mapItemResponse(response)),
      catchError(this.handleError)
    );
  }

  update(id: ID, data: Partial<TEntity>, options?: unknown): Observable<TEntity> {
    void options;
    return this.#httpClient.patch(`${this.#apiUrl}/${id}`, data).pipe(
      map(response => this.mapItemResponse(response)),
      catchError(this.handleError)
    );
  }

  delete(id: ID): Observable<boolean> {
    return this.#httpClient.delete(`${this.#apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(this.handleError)
    );
  }
}
