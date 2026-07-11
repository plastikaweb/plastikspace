import { BasePocketBaseEntity } from './base-pocketbase-entity';

export type UserContact = Omit<
  BasePocketBaseEntity,
  'name' | 'normalizedName' | 'created' | 'updated' | 'collectionId' | 'collectionName'
> & {
  name: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  default?: boolean;
  active?: boolean;
};

export type UserContactForm = Omit<UserContact, 'active'>;
