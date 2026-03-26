import { BasePocketBaseEntity, BasePocketBaseEntityWithTenantRef } from './base-pocketbase-entity';
import { UserContact } from './user-contact';

export type PocketBaseUserRoles = 'PARTNER' | 'GLOBAL_ADMIN' | 'TENANT_ADMIN';

export type PocketBaseMembershipStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL';

export type PocketBaseUser = BasePocketBaseEntityWithTenantRef & {
  name: string;
  email: string;
  role: PocketBaseUserRoles;
  emailVisibility: boolean;
  verified: boolean;
  avatar?: string;
  phone?: string;
  membershipStatus: PocketBaseMembershipStatus;
  trialEndsAt: Date | null;
};

export type PocketBaseUserAddress = Pick<
  BasePocketBaseEntity,
  'id' | 'collectionId' | 'collectionName' | 'created' | 'updated'
> &
  UserContact & {
    user: PocketBaseUser['id'];
  };
