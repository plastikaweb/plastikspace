import { BasePocketBaseEntityNameless } from './base-pocketbase-entity';

export type UserFiscalProfile = Omit<
  BasePocketBaseEntityNameless,
  'created' | 'updated' | 'collectionId' | 'collectionName' | 'description'
> & {
  fiscalName: string;
  nif: string;
  address: string;
  city: string;
  zip: string;
};

export type UserFiscalProfileForm = Omit<UserFiscalProfile, 'id'> & { id?: string };
