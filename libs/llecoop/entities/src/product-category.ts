import { BaseEntity } from '@plastik/core/entities';

export interface ProductCategory extends BaseEntity {
  description: string;
  color: `#${string}`;
  productCount: number;
}
