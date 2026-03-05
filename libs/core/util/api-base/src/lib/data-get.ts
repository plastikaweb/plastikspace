import { InjectionToken } from '@angular/core';
import { BaseEntity, IdType } from '@plastik/core/entities';
import { Observable } from 'rxjs';

// DATA GET LIST //

/**
 * @description Contract for a service that retrieves collections of items. Use this when you only need to fetch lists of data.
 * @template T - Entity type returned by the service.
 * @template TList - Payload type returned by the list endpoint.
 * @template PARAMS - Optional parameter object passed to the request.
 * @example
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
 * export class ProductListService implements DataGetList<Product, ProductList, Partial<ProductSearchParams>> {
 *   getList(params?: ProductSearchParams): Observable<ProductList> {
 *     return this.http.get<ProductList>('/api/products', { params });
 *   }
 * }
 * ```
 */
export interface DataGetList<T extends BaseEntity, TList, PARAMS = Record<string, unknown>> {
  readonly _entityType?: T; // Type safety that forces T to be a BaseEntity and to be declared explicitly.
  getList(params?: PARAMS): Observable<TList>;
}

/**
 * @description Creates an injection token for a data list service. Use this when you only need to fetch lists of data.
 * @param {string} description - Token description for debugging purposes.
 * @returns {InjectionToken<DataGetList<T, TList, PARAMS>>} An injection token for the service.
 * @template T - Entity type returned by the service.
 * @template TList - Payload type returned by the list endpoint.
 * @template PARAMS - Optional parameter object passed to the request.
 * @example
 * ```typescript
 * const PRODUCT_LIST_SERVICE = createDataGetListServiceToken<Product, ProductList, Partial<ProductSearchParams>>(
 *   'PRODUCT_LIST_SERVICE'
 * );
 *
 * // In providers:
 * {
 *   provide: PRODUCT_LIST_SERVICE,
 *   useClass: ProductListService
 * }
 * ```
 */
export function createDataGetListServiceToken<
  T extends BaseEntity,
  TList,
  PARAMS = Record<string, unknown>,
>(description = 'DATA_GET_LIST_SERVICE') {
  return new InjectionToken<DataGetList<T, TList, PARAMS>>(description);
}

// DATA GET ONE //

/**
 * @description Contract for retrieving a single entity by identifier. Use this when you only need to fetch individual items.
 * @template T - Entity type returned by the service.
 * @example
 * ```typescript
 * @Injectable()
 * export class ProductGetService implements DataGetOne<Product> {
 *   getOne(id: IdType<Product>): Observable<Product> {
 *     return this.http.get<Product>(`/api/products/${id}`);
 *   }
 * }
 * ```
 */
export interface DataGetOne<T extends BaseEntity> {
  getOne(id: IdType<T>): Observable<T>;
}

/**
 * @description Creates an injection token for a data get service (single item only). Use this when you only need to fetch individual items.
 * @param {string} description - Token description for debugging purposes.
 * @returns {InjectionToken<DataGetOne<T>>} An injection token for the service.
 * @template T - Entity type returned by the service.
 * @example
 * ```typescript
 * const PRODUCT_GET_SERVICE = createDataGetOneServiceToken<Product>(
 *   'PRODUCT_GET_SERVICE'
 * );
 *
 * // In providers:
 * {
 *   provide: PRODUCT_GET_SERVICE,
 *   useClass: ProductGetService
 * }
 * ```
 */
export function createDataGetOneServiceToken<T extends BaseEntity>(
  description = 'DATA_GET_ONE_SERVICE'
) {
  return new InjectionToken<DataGetOne<T>>(description);
}

// DATA GET LIST + ONE //

/**
 * @description Contract for a service that retrieves both collections and individual items. Use this when you need both list and detail fetching capabilities. Combines DataGetList and DataGetOne interfaces.
 * @template T - Entity type returned by the service.
 * @template TList - Payload type returned by the list endpoint.
 * @template PARAMS - Optional parameter object passed to the list request.
 * @example
 * ```typescript
 * @Injectable()
 * export class ProductService implements DataGet<Product, Product[], ProductSearchParams> {
 *   getList(params?: ProductSearchParams): Observable<Product[]> {
 *     return this.http.get<Product[]>('/api/products', { params });
 *   }
 *
 *   getOne(id: IdType<Product>): Observable<Product> {
 *     return this.http.get<Product>(`/api/products/${id}`);
 *   }
 * }
 * ```
 */
export interface DataGet<T extends BaseEntity, TList, PARAMS = Record<string, unknown>>
  extends DataGetList<T, TList, PARAMS>, DataGetOne<T> {}

/**
 * @description Creates an injection token for a data get service with list capabilities. Use this when you need both list and detail fetching (combines DataGetList + DataGetOne).
 * @param {string} description - Token description for debugging purposes.
 * @returns {InjectionToken<DataGet<T, TList, PARAMS>>} An injection token for the service.
 * @template T - Entity type returned by the service.
 * @template TList - Payload type returned by the list endpoint.
 * @template PARAMS - Optional parameter object passed to the list request.
 * @example
 * ```typescript
 * const PRODUCT_SERVICE = createDataGetServiceToken<Product, Product[], ProductSearchParams>(
 *   'PRODUCT_SERVICE'
 * );
 *
 * // In providers:
 * {
 *   provide: PRODUCT_SERVICE,
 *   useClass: ProductService
 * }
 * ```
 */
export function createDataGetServiceToken<
  T extends BaseEntity,
  TList,
  PARAMS = Record<string, unknown>,
>(description = 'DATA_GET_SERVICE') {
  return new InjectionToken<DataGet<T, TList, PARAMS>>(description);
}
