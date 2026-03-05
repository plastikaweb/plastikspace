import { InjectionToken } from '@angular/core';
import { IdType } from '@plastik/core/entities';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { RecordOptions } from 'pocketbase';

export interface PocketBaseListStore<T extends BasePocketBaseEntity = BasePocketBaseEntity> {
  entity?: T;
  setParams(params?: Record<string, unknown>): void;
  getList(): void;
}

export interface PocketBaseGetStore<
  T extends BasePocketBaseEntity = BasePocketBaseEntity,
> extends PocketBaseListStore<T> {
  getOne(id: IdType<T>): void;
}

export interface PocketBaseCrudStore<
  T extends BasePocketBaseEntity = BasePocketBaseEntity,
> extends PocketBaseGetStore<T> {
  create(payload: { data: Partial<T>; options?: RecordOptions }): void;
  update(payload: { id: IdType<T>; data: Partial<T>; options?: RecordOptions }): void;
  delete(id: IdType<T>): void;
}

export const POCKETBASE_LIST_STORE_TOKEN = new InjectionToken<PocketBaseListStore>(
  'POCKETBASE_LIST_STORE_TOKEN'
);

export const POCKETBASE_GET_STORE_TOKEN = new InjectionToken<PocketBaseGetStore>(
  'POCKETBASE_GET_STORE_TOKEN'
);

export const POCKETBASE_CRUD_STORE_TOKEN = new InjectionToken<PocketBaseCrudStore>(
  'POCKETBASE_CRUD_STORE_TOKEN'
);
