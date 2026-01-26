import { BasePocketBaseEntity } from './base-pocketbase-entity';

export type UserContact = Omit<
  BasePocketBaseEntity,
  'name' | 'normalizedName' | 'created' | 'updated' | 'collectionId' | 'collectionName'
> & {
  name: string;
  fullName?: string;
  address: string;
  city: string | undefined;
  zip: string | undefined;
  province: string | undefined;
  country: string | undefined;
  phone: string | undefined;
  default?: boolean;
  active?: boolean;
  instructions?: string;
};
