import { ListResult, RecordFullListOptions, RecordListOptions, RecordOptions } from 'pocketbase';
import { Observable } from 'rxjs';
import { IGetAll } from '../data-crud-unified';

/**
 * Interface for read-only operations (get all records)
 */
export interface IPocketBaseGetAll<T>
  extends IGetAll<ListResult<T>, RecordListOptions | RecordFullListOptions> {
  getList(params?: RecordListOptions): Observable<ListResult<T>>;
  getFullList(params?: RecordFullListOptions): Observable<T[]>;
}

/**
 * Interface for single record operations
 */
export interface IPocketBaseGetOne<T> {
  getOne(id: string, options?: RecordOptions): Observable<T>;
  getFirstListItem(filter: string, options?: RecordOptions): Observable<T>;
}

/**
 * Interface for create operations
 */
export interface IPocketBaseCreate<T> {
  create(data: Partial<T>, options?: RecordOptions): Observable<T>;
}

/**
 * Interface for update operations
 */
export interface IPocketBaseUpdate<T> {
  update(id: string, data: Partial<T>, options?: RecordOptions): Observable<T>;
}

/**
 * Interface for delete operations
 */
export interface IPocketBaseDelete {
  delete(id: string): Observable<boolean>;
}

/**
 * Interface for PocketBase error responses
 */
export interface PocketBaseError {
  data?: Record<string, unknown>;
  message: string;
  status: number;
}
