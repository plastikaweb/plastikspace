import { BasePocketBaseEntityWithTenantRef, BasePocketBaseEntity } from './base-pocketbase-entity';
import { UserContact } from './user-contact';

export type PocketBaseUserRoles = 'PARTNER' | 'GLOBAL_ADMIN' | 'CLIENT_ADMIN';

export type PocketBaseUser = BasePocketBaseEntityWithTenantRef & {
  name: string;
  email: string;
  role: PocketBaseUserRoles;
  emailVisibility: boolean;
  verified: boolean;
  avatar?: string;
  phone?: string;
};

export type PocketBaseUserAddress = Pick<
  BasePocketBaseEntity,
  'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'
> &
  UserContact & {
    user: PocketBaseUser['id'];
    default: boolean;
    fullName?: string;
  };
