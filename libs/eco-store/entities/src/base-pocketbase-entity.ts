import { ListOptions } from 'pocketbase';
import { BaseEntity } from '@plastik/core/entities';

export type BasePocketBaseEntity = Pick<BaseEntity<string>, 'name' | 'normalizedName'> & {
  readonly id: string;
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
