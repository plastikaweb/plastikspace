import { inject } from '@angular/core';
import { BaseDataService, DataCrud } from '@plastik/core/api-base';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import {
  ClientResponseError,
  ListResult,
  RecordFullListOptions,
  RecordListOptions,
  RecordOptions,
} from 'pocketbase';
import { catchError, from, map, Observable, shareReplay } from 'rxjs';
import { POCKETBASE_INSTANCE } from './pocketbase.token';

/**
 * @description Abstract base class for PocketBase services with common functionality.
 * Provides shared methods and configuration for all PocketBase operations.
 * @template T - The entity type that extends BasePocketBaseEntity
 * @template PARAMS - The type of parameters for list operations (RecordListOptions or RecordFullListOptions)
 */
export abstract class PocketBaseCrudService<
    T extends BasePocketBaseEntity = BasePocketBaseEntity,
    PARAMS extends RecordListOptions | RecordFullListOptions = RecordListOptions,
  >
  extends BaseDataService
  implements DataCrud<T, ListResult<T>, PARAMS, Partial<T>, RecordOptions>
{
  readonly #pb = inject(POCKETBASE_INSTANCE);

  /**
   * @description Implement this method in child classes to have the collection name.
   * @returns {string} The collection name.
   */
  protected abstract collectionName(): string;

  /**
   * @description Method to map the PocketBase response with the inner typings before storing it in app.
   * Override this method in child classes when inheriting from PocketBaseBaseService with your custom response structures.
   * @param { T } data The PocketBase response data as it is.
   * @returns { T } The mapped response.
   */
  protected mapResponse(data: T): T {
    return data;
  }

  /**
   * @param { ListResult<T> } data The list response data as it is.
   * @returns { ListResult<T> } The mapped list response.
   * @description Method to map list responses.
   */
  protected mapListResponse(data: ListResult<T>): ListResult<T> {
    return {
      ...data,
      items: data.items.map((item: T) => this.mapResponse(item)),
    };
  }

  /**
   * @param { PARAMS } params The list parameters.
   * @returns { Observable<ListResult<T>> } The list of records.
   * @description Get a list of records.
   */
  public getList(params?: PARAMS): Observable<ListResult<T>> {
    return from(
      this.#pb
        .collection(this.collectionName())
        .getList<T>(
          (params as RecordListOptions)?.page || 1,
          (params as RecordListOptions)?.perPage || 50,
          (params as Omit<RecordListOptions, 'page' | 'perPage'>) || {}
        )
    ).pipe(
      map(data => this.mapListResponse(data)),
      shareReplay({ bufferSize: 1, refCount: true, windowTime: this.cacheTime }),
      catchError(error => this.handleError<ClientResponseError>(error))
    );
  }

  /**
   * @param { RecordFullListOptions } params The full list parameters.
   * @returns { Observable<T[]> } The full list of records.
   * @description Get all records (max 500 by default).
   */
  public getFullList(params?: RecordFullListOptions): Observable<T[]> {
    return from(this.#pb.collection(this.collectionName()).getFullList<T>(params)).pipe(
      map(items => items.map(item => this.mapResponse(item))),
      shareReplay({ bufferSize: 1, refCount: true, windowTime: this.cacheTime }),
      catchError(error => this.handleError<ClientResponseError>(error))
    );
  }

  /**
   * @param { string } id The record ID.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The single record.
   * @description Get a single record by ID.
   */
  public getOne(id: string, options?: RecordOptions): Observable<T> {
    return from(this.#pb.collection(this.collectionName()).getOne<T>(id, options)).pipe(
      map(data => this.mapResponse(data)),
      shareReplay({ bufferSize: 1, refCount: true, windowTime: this.cacheTime }),
      catchError(error => this.handleError<ClientResponseError>(error))
    );
  }

  /**
   * @param { string } filter The filter.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The first record matching the filter.
   * @description Get the first record matching the filter.
   */
  public getFirstListItem(filter: string, options?: RecordOptions): Observable<T> {
    return from(
      this.#pb.collection(this.collectionName()).getFirstListItem<T>(filter, options)
    ).pipe(
      map(data => this.mapResponse(data)),
      shareReplay({ bufferSize: 1, refCount: true, windowTime: this.cacheTime }),
      catchError(error => this.handleError<ClientResponseError>(error))
    );
  }

  /**
   * @param { Partial<T> } data The record data.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The created record.
   * @description Create a new record.
   */
  public create(data: Partial<T>, options?: RecordOptions): Observable<T> {
    return from(this.#pb.collection(this.collectionName()).create<T>(data, options)).pipe(
      map(response => this.mapResponse(response)),
      catchError(error => this.handleError<ClientResponseError>(error))
    );
  }

  /**
   * @param { string } id The record ID.
   * @param { Partial<T> } data The record data.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The updated record.
   * @description Update an existing record.
   */
  public update(id: string, data: Partial<T>, options?: RecordOptions): Observable<T> {
    return from(this.#pb.collection(this.collectionName()).update<T>(id, data, options)).pipe(
      map(response => this.mapResponse(response)),
      catchError(error => this.handleError<ClientResponseError>(error))
    );
  }

  /**
   * @param { string } id The record ID.
   * @returns { Observable<boolean> } The deletion result.
   * @description Delete a record.
   */
  public delete(id: string): Observable<boolean> {
    return from(this.#pb.collection(this.collectionName()).delete(id)).pipe(
      map(() => true),
      catchError(error => this.handleError<ClientResponseError>(error))
    );
  }
}
