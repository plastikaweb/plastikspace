import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Common options for read operations
 */
export interface ReadOptions {
  page?: number;
  perPage?: number;
  filter?: string;
  sort?: string;
  expand?: string[];
}

/**
 * Common options for write operations
 */
export interface WriteOptions {
  expand?: string[];
}

/**
 * Unified interface for read-only operations (get all records)
 * @template T - The entity type
 * @template RESULT - The result structure (defaults to T[] for simple array responses)
 * @template PARAMS - The parameters type
 */
export interface IGetAll<RESULT, PARAMS = Record<string, unknown>> {
  getList(params?: PARAMS): Observable<RESULT>;
}

/**
 * Unified interface for single record operations
 */
export interface IGetOneService<T, ID = string, OPTIONS extends ReadOptions = ReadOptions> {
  getOne(id: ID, options?: OPTIONS): Observable<T>;
  getFirstListItem(filter: string, options?: OPTIONS): Observable<T>;
}

/**
 * Unified interface for create operations
 */
export interface ICreateService<
  T,
  Create = Partial<T>,
  OPTIONS extends WriteOptions = WriteOptions,
> {
  create(data: Create, options?: OPTIONS): Observable<T>;
}

/**
 * Unified interface for update operations
 */
export interface IUpdateService<
  T,
  ID = string,
  Update = Partial<T>,
  OPTIONS extends WriteOptions = WriteOptions,
> {
  update(id: ID, data: Update, options?: OPTIONS): Observable<T>;
}

/**
 * Unified interface for delete operations
 */
export interface IDeleteService<ID = string> {
  delete(id: ID): Observable<boolean>;
}

/**
 * Union of the supported CRUD operation keys
 */
export type CrudOperation = 'getList' | 'getOne' | 'create' | 'update' | 'delete';

/**
 * Convenience type that combines list and single read operations
 */
export type ReadService<
  T,
  PARAMS extends ReadOptions = ReadOptions,
  ID = string,
  OPTIONS extends ReadOptions = ReadOptions,
> = IGetAll<T, PARAMS> & IGetOneService<T, ID, OPTIONS>;

/**
 * Convenience type that combines create, update, and delete operations
 */
export type WriteService<
  T,
  ID = string,
  OPTIONS extends WriteOptions = WriteOptions,
  Create = Partial<T>,
  Update = Partial<T>,
> = ICreateService<T, Create, OPTIONS> &
  IUpdateService<T, ID, Update, OPTIONS> &
  IDeleteService<ID>;

/**
 * Helper that conditionally includes an operation contract when declared in CrudOperation
 */
type MaybeInclude<TOperations extends CrudOperation, TOperation extends CrudOperation, TType> =
  Extract<TOperations, TOperation> extends never ? object : TType;

/**
 * Shape of a unified CRUD API with optional operations controlled through CrudOperation
 */
export type CrudApiService<
  T,
  PARAMS extends ReadOptions = ReadOptions,
  ID = string,
  ReadOptionsType extends ReadOptions = ReadOptions,
  WriteOptionsType extends WriteOptions = WriteOptions,
  Create = Partial<T>,
  Update = Partial<T>,
  TOperations extends CrudOperation = CrudOperation,
> = MaybeInclude<TOperations, 'getList', IGetAll<T, PARAMS>> &
  MaybeInclude<TOperations, 'getOne', IGetOneService<T, ID, ReadOptionsType>> &
  MaybeInclude<TOperations, 'create', ICreateService<T, Create, WriteOptionsType>> &
  MaybeInclude<TOperations, 'update', IUpdateService<T, ID, Update, WriteOptionsType>> &
  MaybeInclude<TOperations, 'delete', IDeleteService<ID>>;

/**
 * Unified error response structure
 */
export interface CrudError {
  data?: Record<string, unknown>;
  message: string;
  code: number;
  originalError?: unknown;
}

/**
 * Provider types for dependency injection
 */
export const CRUD_API_SERVICE_TOKEN = new InjectionToken<
  CrudApiService<
    unknown,
    ReadOptions,
    unknown,
    ReadOptions,
    WriteOptions,
    unknown,
    unknown,
    CrudOperation
  >
>('CRUD_API_SERVICE_TOKEN');

export const READ_SERVICE_TOKEN = new InjectionToken<ReadService<unknown, ReadOptions>>(
  'READ_SERVICE_TOKEN'
);

export const WRITE_SERVICE_TOKEN = new InjectionToken<WriteService<unknown, unknown, WriteOptions>>(
  'WRITE_SERVICE_TOKEN'
);

export const GET_ALL_SERVICE_TOKEN = new InjectionToken<IGetAll<unknown, ReadOptions>>(
  'GET_ALL_SERVICE_TOKEN'
);

export const GET_ONE_SERVICE_TOKEN = new InjectionToken<
  IGetOneService<unknown, unknown, ReadOptions>
>('GET_ONE_SERVICE_TOKEN');

export const CREATE_SERVICE_TOKEN = new InjectionToken<
  ICreateService<unknown, unknown, WriteOptions>
>('CREATE_SERVICE_TOKEN');

export const UPDATE_SERVICE_TOKEN = new InjectionToken<
  IUpdateService<unknown, unknown, unknown, WriteOptions>
>('UPDATE_SERVICE_TOKEN');

export const DELETE_SERVICE_TOKEN = new InjectionToken<IDeleteService<unknown>>(
  'DELETE_SERVICE_TOKEN'
);
