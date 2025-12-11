import { ListOptions } from 'pocketbase';
import { BaseEntity } from './base-entity';

export type BasePocketBaseEntity = Pick<BaseEntity<string>, 'name' | 'normalizedName'> & {
  readonly id: string;
  readonly collectionId: string;
  readonly collectionName: string;
  created: Date;
  updated: Date;
};

export type BasePocketBaseEntitySimple = Omit<BasePocketBaseEntity, 'normalizedName'>;

/**
 * @description A base entity that needs a client reference to segment data by client.
 */
export interface BasePocketBaseEntityWithClientRef extends BasePocketBaseEntity {
  client: string;
}

export type BasePocketBaseEntityPagination = Required<Pick<ListOptions, 'page' | 'perPage'>>;

export type PocketBaseSortOptions = Record<
  BasePocketBaseEntitySort['sort'],
  BasePocketBaseEntitySort['direction'][]
>;

export type BasePocketBaseEntitySort = Required<
  Pick<ListOptions, 'sort'> & { direction: 'asc' | 'desc' }
>;

export type BasePocketBaseEntityFilter = Required<Record<string, string | null | boolean>>;
