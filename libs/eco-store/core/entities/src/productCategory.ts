import {
  BasePocketBaseEntitySimple,
  BasePocketBaseEntityWithTenantRef,
  LocalizedFields,
} from '@plastik/core/entities';

export type ProductCategoryGroup = BasePocketBaseEntitySimple;

export interface ProductCategory extends BasePocketBaseEntityWithTenantRef {
  color: string;
  icon?: string;
  expand?: {
    group: ProductCategoryGroup;
  };
}

/**
 * @description Type for creating a new ProductCategory.
 * Excludes id, created, updated as they are set by the system.
 */
export type CreateProductCategory = Omit<
  ProductCategory,
  'id' | 'created' | 'updated' | 'normalizedName'
>;

/**
 * @description Type for updating an existing ProductCategory.
 * All fields are optional except id which is required for identification.
 * Excludes system-managed fields.
 */
export type UpdateProductCategory = Partial<
  Omit<ProductCategory, 'id' | 'created' | 'updated' | 'normalizedName' | 'client'>
> & {
  id: string; // we make id required for identification
};

/**
 * @description Type for ProductCategory queries and filters.
 */
export interface ProductCategoryFilters {
  client?: string;
  name?: string;
  search?: string;
}

export interface ProductCategoryStats extends BasePocketBaseEntityWithTenantRef {
  category: ProductCategory['id'];
  totalProducts: number;
  color: string;
  groupName: LocalizedFields;
  icon?: string;
}
