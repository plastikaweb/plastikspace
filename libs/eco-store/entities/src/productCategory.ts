import { BasePocketBaseEntityWithClientRef } from './base-pocketbase-entity';

export interface ProductCategory extends BasePocketBaseEntityWithClientRef {
  color: string;
  description?: string;
  productCount: number;
}

/**
 * @description Type for creating a new ProductCategory.
 * Excludes id, created, updated, and productCount as they are set by the system.
 */
export type CreateProductCategory = Omit<
  ProductCategory,
  'id' | 'created' | 'updated' | 'normalizedName' | 'productCount'
>;

/**
 * @description Type for updating an existing ProductCategory.
 * All fields are optional except id which is required for identification.
 * Excludes system-managed fields.
 */
export type UpdateProductCategory = Partial<
  Omit<
    ProductCategory,
    'id' | 'created' | 'updated' | 'normalizedName' | 'clientId' | 'productCount'
  >
> & {
  id: string; // we make id required for identification
};

/**
 * @description Type for ProductCategory queries and filters.
 */
export interface ProductCategoryFilters {
  clientId?: string;
  name?: string;
  search?: string;
}
