import { InjectionToken } from '@angular/core';
import { DataApiService, DataGetListService, DataReadService, DataWriteService } from './data-crud';

/**
 * @template TList, P
 * @description Creates an injection token for a data list service.
 * @param { string } description The description of the token.
 * @returns { InjectionToken<DataGetListService<TList, P>> } The created injection token.
 */
export function createDataGetListServiceToken<TList, P = unknown>(
  description = 'DATA_GET_LIST_SERVICE'
) {
  return new InjectionToken<DataGetListService<TList, P>>(description);
}

/**
 * @template T, TList, P, ID, ReadOptions, WriteOptions, Create, Update
 * @description Creates an injection token for a data crud service.
 * @param { string } description The description of the token.
 * @returns { InjectionToken<DataApiService<T, TList, P, ID, ReadOptions, WriteOptions, Create, Update>> } The created injection token.
 */
export function createDataServiceToken<
  T,
  TList,
  P = unknown,
  ID = string,
  ReadOptions = unknown,
  WriteOptions = unknown,
  Create = Partial<T>,
  Update = Partial<T>,
>(description = 'DATA_CRUD_SERVICE') {
  return new InjectionToken<
    DataApiService<T, TList, P, ID, ReadOptions, WriteOptions, Create, Update>
  >(description);
}

/**
 * @template T, TList, P, ID, ReadOptions
 * @description Creates an injection token for a data read service.
 * @param { string } description The description of the token.
 * @returns { InjectionToken<DataReadService<T, TList, P, ID, ReadOptions>> } The created injection token.
 */
export function createDataReadServiceToken<
  T,
  TList,
  P = unknown,
  ID = string,
  ReadOptions = unknown,
>(description = 'DATA_READ_SERVICE') {
  return new InjectionToken<DataReadService<T, TList, P, ID, ReadOptions>>(description);
}

/**
 * @template T, ID, WriteOptions, Create, Update
 * @description Creates an injection token for a data write service.
 * @param { string } description The description of the token.
 * @returns { InjectionToken<DataWriteService<T, ID, WriteOptions, Create, Update>> } The created injection token.
 */
export function createDataWriteServiceToken<
  T,
  ID = string,
  WriteOptions = unknown,
  Create = Partial<T>,
  Update = Partial<T>,
>(description = 'DATA_WRITE_SERVICE') {
  return new InjectionToken<DataWriteService<T, ID, WriteOptions, Create, Update>>(description);
}
