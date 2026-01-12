import { BaseEntity } from '@plastik/core/entities';

export interface EcoStoreTenant extends BaseEntity {
  email: string;
  phone?: string;
  address?: string;
  languages: string[];
  themeConfig?: unknown;
}
