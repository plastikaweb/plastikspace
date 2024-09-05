import { BaseEntity } from '@plastik/core/entities';

export interface LlecoopProductCategory extends BaseEntity {
  description: string;
  color: `#${string}`;
  productCount: number;
}
