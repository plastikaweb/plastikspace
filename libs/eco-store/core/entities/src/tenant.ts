import { BasePocketBaseEntity } from '@plastik/core/entities';

export interface EcoStoreTenant extends BasePocketBaseEntity {
  email: string;
  name: string;
  phone?: string;
  logo?: string;
  address?: string;
  languages: string[];
  themeConfig?: unknown;
}
