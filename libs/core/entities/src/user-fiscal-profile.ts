import { BasePocketBaseEntity } from './base-pocketbase-entity';

export type UserFiscalProfile = Omit<
  BasePocketBaseEntity,
  'name' | 'normalizedName' | 'created' | 'updated' | 'collectionId' | 'collectionName'
> & {
  fiscalName: string;
  nif: string;
  address: string;
  city: string;
  zip: string;
};

export type UserFiscalProfileForm = Omit<UserFiscalProfile, 'id'> & { id?: string };
