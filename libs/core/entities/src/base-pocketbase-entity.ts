import { ListOptions } from 'pocketbase';
import { BaseEntity, LocalizedFields } from './base-entity';

export type BasePocketBaseEntity = Pick<BaseEntity<string>, 'name' | 'normalizedName'> & {
  readonly id: string;
  readonly collectionId: string;
  readonly collectionName: string;
  created: Date;
  updated: Date;
  description?: LocalizedFields<string>;
};

export type BasePocketBaseEntitySimple = Omit<BasePocketBaseEntity, 'normalizedName'>;

/**
 * Structural base for PocketBase records whose collection has no name field (e.g. user_fiscal_profiles).
 */
export type BasePocketBaseEntityNameless = Omit<BasePocketBaseEntity, 'name' | 'normalizedName'>;

/**
 * @description A base entity that needs a client reference to segment data by client.
 */
export type BasePocketBaseEntityWithTenantRef = BasePocketBaseEntity & {
  tenant: string;
};

export type BasePocketBaseEntityPagination = Required<Pick<ListOptions, 'page' | 'perPage'>>;

export type BasePocketBaseEntityFilter = Required<Record<string, string | null | boolean>>;
