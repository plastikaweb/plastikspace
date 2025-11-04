import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Contract for a service that retrieves collections of items.
 * @template TList - Payload type returned by the list endpoint.
 * @template P - Optional parameter object passed to the request.
 */
export interface DataGetListService<TList, P = unknown> {
  getList(params?: P): Observable<TList>;
}

/**
 * Contract for retrieving a single entity by identifier.
 * @template T - Entity type returned by the service.
 * @template ID - Identifier type of the entity.
 * @template ReadOptions - Optional read configuration passed to the request.
 */
export interface DataGetOneService<T, ID = string, ReadOptions = unknown> {
  getOne(id: ID, options?: ReadOptions): Observable<T>;
}

/**
 * Contract for creating a new entity in the data source.
 * @template T - Entity type returned by the service after creation.
 * @template Create - Payload structure required to create the entity.
 * @template WriteOptions - Optional write configuration passed to the request.
 */
export interface DataCreateService<T, Create = Partial<T>, WriteOptions = unknown> {
  create(data: Create, options?: WriteOptions): Observable<T>;
}

/**
 * Contract for updating an existing entity.
 * @template T - Entity type returned by the service after the update.
 * @template ID - Identifier type of the entity.
 * @template Update - Payload structure required to update the entity.
 * @template WriteOptions - Optional write configuration passed to the request.
 */
export interface DataUpdateService<T, ID = string, Update = Partial<T>, WriteOptions = unknown> {
  update(id: ID, data: Update, options?: WriteOptions): Observable<T>;
}

/**
 * Contract for deleting an entity by identifier.
 * @template ID - Identifier type of the entity.
 */
export interface DataDeleteService<ID = string> {
  delete(id: ID): Observable<boolean>;
}

/**
 * Union of the supported CRUD operation keys.
 */
export type DataCrudOperation = 'getList' | 'getOne' | 'create' | 'update' | 'delete';

/**
 * Convenience type that combines list and single read operations.
 */
export type DataReadService<
  T,
  TList,
  P = unknown,
  ID = string,
  ReadOptions = unknown,
> = DataGetListService<TList, P> & DataGetOneService<T, ID, ReadOptions>;

/**
 * Convenience type that combines create, update, and delete operations.
 */
export type DataWriteService<
  T,
  ID = string,
  WriteOptions = unknown,
  Create = Partial<T>,
  Update = Partial<T>,
> = DataCreateService<T, Create, WriteOptions> &
  DataUpdateService<T, ID, Update, WriteOptions> &
  DataDeleteService<ID>;

/**
 * Helper that conditionally includes an operation contract when declared in {@link DataCrudOperation}.
 */
type MaybeInclude<
  TOperations extends DataCrudOperation,
  TOperation extends DataCrudOperation,
  TType,
> = Extract<TOperations, TOperation> extends never ? object : TType;

/**
 * Shape of a CRUD API with optional operations controlled through {@link DataCrudOperation}.
 */
export type DataApiService<
  T,
  TList,
  P = unknown,
  ID = string,
  ReadOptions = unknown,
  WriteOptions = unknown,
  Create = Partial<T>,
  Update = Partial<T>,
  TOperations extends DataCrudOperation = DataCrudOperation,
> = MaybeInclude<TOperations, 'getList', DataGetListService<TList, P>> &
  MaybeInclude<TOperations, 'getOne', DataGetOneService<T, ID, ReadOptions>> &
  MaybeInclude<TOperations, 'create', DataCreateService<T, Create, WriteOptions>> &
  MaybeInclude<TOperations, 'update', DataUpdateService<T, ID, Update, WriteOptions>> &
  MaybeInclude<TOperations, 'delete', DataDeleteService<ID>>;

/**
 * Injection token for providing a generic CRUD API.
 */
export const API_SERVICE_TOKEN = new InjectionToken<
  DataApiService<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    DataCrudOperation
  >
>('API_SERVICE_TOKEN');

/**
 * Injection token for read-only data services.
 */
export const DATA_READ_SERVICE_TOKEN = new InjectionToken<DataReadService<unknown, unknown>>(
  'DATA_READ_SERVICE_TOKEN'
);

/**
 * Injection token for write-capable data services.
 */
export const DATA_WRITE_SERVICE_TOKEN = new InjectionToken<DataWriteService<unknown, unknown>>(
  'DATA_WRITE_SERVICE_TOKEN'
);

/**
 * Injection token for list retrieval services.
 */
export const DATA_GET_LIST_SERVICE_TOKEN = new InjectionToken<DataGetListService<unknown, unknown>>(
  'DATA_GET_LIST_SERVICE_TOKEN'
);

/**
 * Injection token for single-entity retrieval services.
 */
export const DATA_GET_ONE_SERVICE_TOKEN = new InjectionToken<DataGetOneService<unknown, unknown>>(
  'DATA_GET_ONE_SERVICE_TOKEN'
);

/**
 * Injection token for entity creation services.
 */
export const DATA_CREATE_SERVICE_TOKEN = new InjectionToken<DataCreateService<unknown, unknown>>(
  'DATA_CREATE_SERVICE_TOKEN'
);

/**
 * Injection token for entity update services.
 */
export const DATA_UPDATE_SERVICE_TOKEN = new InjectionToken<DataUpdateService<unknown, unknown>>(
  'DATA_UPDATE_SERVICE_TOKEN'
);
