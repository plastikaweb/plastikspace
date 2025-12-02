import { BaseEntity } from '@plastik/core/entities';
import { ListOptions } from 'pocketbase';

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

export type BasePocketBaseEntityPagination = Pick<ListOptions, 'page' | 'perPage'>;
export type BasePocketBaseEntitySort = Pick<ListOptions, 'sort'> & { direction?: 'asc' | 'desc' };
export type BasePocketBaseEntityFilter = Record<string, string | null | boolean>;
