export type LocalizedFields = Record<'ca' | 'es' | 'en', string>;
import { ListOptions } from 'pocketbase';

export interface BasePocketBaseEntity {
  id: string;
  name: LocalizedFields | string;
  normalizedName: string;
  created: Date;
  updated: Date;
}

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
