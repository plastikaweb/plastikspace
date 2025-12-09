import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Params } from '@angular/router';
import { BaseDataService, DataCrud } from '@plastik/core/api-base';
import { BaseEntity, IdType } from '@plastik/core/entities';
import { ENVIRONMENT_WITH_API } from '@plastik/core/environments';
import { catchError, map, Observable, ReplaySubject, share, timer } from 'rxjs';

/**
 * @description Abstract class to inherit from on creating a feature HTTP service for full CRUD operations.
 * Combines functionality for getting list, getting one, creating, updating, and deleting records.
 * @template TEntity - The entity type
 * @template TListResult - The list result type (defaults to TEntity[])
 * @template PARAMS - The parameters type for the API call (extends Params)
 */
export abstract class HttpCrudService<
    T extends BaseEntity,
    TListResult = T[],
    PARAMS extends Params = Params,
  >
  extends BaseDataService
  implements DataCrud<T, TListResult, PARAMS, Partial<T>>
{
  override readonly environment = inject(ENVIRONMENT_WITH_API);
  readonly httpClient = inject(HttpClient);
  readonly apiUrl: string;

  constructor() {
    super();
    this.apiUrl = `${this.getApiUrlFromEnvironment()}/${this.resourceUrlSegment()}`;
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
   * @description Method to map the API list response with the inner typings before storing it in app.
   * Override this method in child classes when inheriting from ApiService with your custom API response structures.
   * @param { unknown } data The API response data as it is.
   * @returns { TListResult } The mapped API response.
   */
  protected mapListResponse(data: unknown): TListResult {
    return data as unknown as TListResult;
  }

  /**
   * @description Method to map the API item response with the inner typings before storing it in app.
   * Override this method in child classes when inheriting from ApiService with your custom API response structures.
   * @param { unknown } data The API response data as it is.
   * @returns { TEntity } The mapped API response.
   */
  protected mapItemResponse(data: unknown): T {
    return data as T;
  }

  /**
   * @description A GET method to retrieve a list of data.
   * @param { PARAMS } params  The http params to pass with the API call.
   * @returns { Observable<TListResult> } The API data response after mapping or an error catch.
   */
  getList(params?: PARAMS): Observable<TListResult> {
    return this.httpClient.get(this.apiUrl, { params: this.getHttpParams(params) }).pipe(
      map(data => this.mapListResponse(data)),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(this.cacheTime),
      }),
      catchError(this.handleError)
    );
  }

  /**
   * @description Get a single record by ID.
   * @param {IdType<T>} id - The record ID.
   * @param {unknown} options - The record options.
   * @returns {Observable<T>} The single record.
   */
  getOne(id: IdType<T>, options?: unknown): Observable<T> {
    void options;
    return this.httpClient.get(`${this.apiUrl}/${id}`).pipe(
      map(response => this.mapItemResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * @description Create a new record.
   * @param { Partial<T> } data The record data.
   * @param { unknown } options The record options.
   * @returns { Observable<T> } The created record.
   */
  create(data: Partial<T>, options?: unknown): Observable<T> {
    void options;
    return this.httpClient.post(this.apiUrl, data).pipe(
      map(response => this.mapItemResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * @description Update an existing record.
   * @param {IdType<T>} id - The record ID.
   * @param {Partial<T>} data - The record data.
   * @param {unknown} options - The record options.
   * @returns {Observable<T>} The updated record.
   */
  update(id: IdType<T>, data: Partial<T>, options?: unknown): Observable<T> {
    void options;
    return this.httpClient.patch(`${this.apiUrl}/${id}`, data).pipe(
      map(response => this.mapItemResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * @description Delete a record.
   * @param {IdType<T>} id - The record ID.
   * @returns {Observable<boolean>} The deletion result.
   */
  delete(id: IdType<T>): Observable<boolean> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(this.handleError)
    );
  }

  /**
   * @description Helper to convert params object to HttpParams.
   * @param {PARAMS} params - The parameters to convert to HttpParams.
   * @returns {HttpParams} The converted HttpParams object.
   */
  protected getHttpParams(params?: PARAMS): HttpParams {
    let httpClientParams: HttpParams = new HttpParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpClientParams = httpClientParams.set(key, `${value}`);
      }
    });

    return httpClientParams;
  }
}
