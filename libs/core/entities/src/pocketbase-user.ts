import { BasePocketBaseEntityWithClientRef } from './base-pocketbase-entity';

export interface PocketBaseUser extends BasePocketBaseEntityWithClientRef {
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  avatar?: string;
}
