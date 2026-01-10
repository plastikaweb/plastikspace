import { BasePocketBaseEntityWithClientRef } from './base-pocketbase-entity';

export type PocketBaseUser = BasePocketBaseEntityWithClientRef & {
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  avatar?: string;
  name: string;
};
