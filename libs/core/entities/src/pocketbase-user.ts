import { BasePocketBaseEntityWithTenantRef } from './base-pocketbase-entity';

export type PocketBaseUserRoles = 'PARTNER' | 'GLOBAL_ADMIN' | 'CLIENT_ADMIN';

export type PocketBaseUser = BasePocketBaseEntityWithTenantRef & {
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  avatar?: string;
  name: string;
  role: PocketBaseUserRoles;
};
