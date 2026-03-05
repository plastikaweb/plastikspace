import { BaseEntity, IdType } from '@plastik/core/entities';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { DataGet } from './data-get';

/**
 * Contract for full CRUD operations on entities.
 * Use this when you need complete create, read, update, delete functionality.
 * @template T - Entity type returned by the service (with ID).
 * @template TList - Payload type returned by the list endpoint.
 * @template PARAMS - Optional parameter object passed to the list request.
 * @template DATA - Input type for create/update operations (defaults to Omit<T, 'id'> since IDs are backend-generated). The service returns the complete T with ID.
 * @template OPTIONS - Optional write configuration passed to requests.
 * @example Basic usage - DATA is the input (without ID), T is the output (with ID)
 * ```typescript
 * interface ProductList {
 *   data: Product[];
 *   count: number;
 * }
 *
 * interface ProductSearchParams {
 *   page: number;
 *   limit: number;
 *   sort: {
 *     field: keyof Product;
 *     order: 'asc' | 'desc';
 *   };
 *   filter: {
 *     name?: string;
 *     category?: string;
 *     price?: string;
 *     stock?: string;
 *   };
 * }
 *
 * @Injectable()
 * export class ProductCrudService implements DataCrud<Product, ProductList, Partial<ProductSearchParams>> {
 *   getList(params?: ProductSearchParams): Observable<ProductList> {
 *     return this.http.get<ProductList>('/api/products', { params });
 *   }
 *
 *   getOne(id: IdType<Product>): Observable<Product> {
 *     return this.http.get<Product>(`/api/products/${id}`);
 *   }
 *
 *   create(data: Omit<Product, 'id'>): Observable<Product> {
 *     return this.http.post<Product>('/api/products', data);
 *   }
 *
 *   update(id: IdType<Product>, data: Omit<Product, 'id'>): Observable<Product> {
 *     return this.http.put<Product>(`/api/products/${id}`, data);
 *   }
 *
 *   delete(id: IdType<Product>): Observable<boolean> {
 *     return this.http.delete<boolean>(`/api/products/${id}`);
 *   }
 * }
 * ```
 * @example Advanced usage - Custom DATA input type
 * ```typescript
 * interface ProductCreateData {
 *   name: string;
 *   description: string;
 *   price: number;
 * }
 *
 * @Injectable()
 * export class ProductCrudService implements DataCrud<Product, ProductList, ProductSearchParams, Partial<Product>, unknown, ProductCreateData> {
 *   create(data: ProductCreateData): Observable<Product> {
 *     return this.http.post<Product>('/api/products', data);
 *   }
 *   // ... other methods
 * }
 * ```
 */
export interface DataCrud<
  T extends BaseEntity,
  TList,
  PARAMS = Record<string, unknown>,
  DATA = Partial<Omit<T, 'id'>>,
  OPTIONS = unknown,
> extends DataGet<T, TList, PARAMS> {
  create(item: DATA, options?: OPTIONS): Observable<T>;
  update(id: IdType<T>, item: DATA, options?: OPTIONS): Observable<T | void>;
  delete(id: IdType<T>, options?: OPTIONS): Observable<unknown>;
}

/**
 * @description Creates an injection token for a full CRUD data service. Use this when you need complete create, read, update, delete functionality.
 * @param {string} description - Token description for debugging purposes.
 * @returns {InjectionToken<DataCrud<T, TList, PARAMS, DATA, OPTIONS>>} An injection token for the CRUD service.
 * @template T - Entity type returned by the service (with ID).
 * @template TList - Payload type returned by the list endpoint.
 * @template PARAMS - Optional parameter object passed to the list request.
 * @template DATA - Input type for create/update operations (defaults to Omit<T, 'id'>).
 * @template OPTIONS - Optional write configuration passed to requests.
 * @example Basic usage
 * ```typescript
 * interface ProductList {
 *   data: Product[];
 *   count: number;
 * }
 *
 * interface ProductSearchParams {
 *   page: number;
 *   limit: number;
 *   sort: {
 *     field: keyof Product;
 *     order: 'asc' | 'desc';
 *   };
 *   filter: {
 *     name?: string;
 *     category?: string;
 *     price?: string;
 *     stock?: string;
 *   };
 * }
 *
 * const PRODUCT_CRUD_SERVICE = createDataCrudServiceToken<Product, ProductList, Partial<ProductSearchParams>>(
 *   'PRODUCT_CRUD_SERVICE'
 * );
 *
 * // In providers:
 * {
 *   provide: PRODUCT_CRUD_SERVICE,
 *   useClass: ProductCrudService
 * }
 * ```
 * @example With custom DATA input type
 * ```typescript
 * interface ProductCreateData {
 *   name: string;
 *   description: string;
 * }
 *
 * const PRODUCT_CRUD_SERVICE = createDataCrudServiceToken<
 *   Product,
 *   ProductList,
 *   ProductSearchParams,
 *   Partial<Product>,
 *   unknown,
 *   ProductCreateData
 * >('PRODUCT_CRUD_SERVICE');
 * ```
 */
export function createDataCrudServiceToken<
  T extends BaseEntity,
  TList,
  PARAMS = Record<string, unknown>,
  DATA = Partial<Omit<T, 'id'>>,
  OPTIONS = unknown,
>(description = 'DATA_CRUD_SERVICE') {
  return new InjectionToken<DataCrud<T, TList, PARAMS, DATA, OPTIONS>>(description);
}
