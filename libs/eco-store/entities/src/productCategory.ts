import { BasePocketBaseEntity } from './base-pocketbase-entity';

export interface ProductCategory extends BasePocketBaseEntity {
  color: string;
  description: string;
  productCount: number;
}

export interface CreateProductCategory {
  name: string;
  color?: string;
  description?: string;
}

export interface UpdateProductCategory {
  name?: string;
  color?: string;
  description?: string;
}
