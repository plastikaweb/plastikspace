import { BaseEntity } from '@plastik/core/entities';

export interface LlecoopUser extends BaseEntity {
  email: string;
  isAdmin: boolean;
  address?: string;
  phone?: string;
  isBlocked?: boolean;
}
