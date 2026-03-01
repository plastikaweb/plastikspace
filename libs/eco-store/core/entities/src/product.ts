import { BasePocketBaseEntityWithTenantRef, LocalizedFields } from '@plastik/core/entities';
import { ProductCategory } from './productCategory';

export type ProductUnitType =
  | 'unit'
  | 'weight'
  | 'volume'
  | 'unitWithFixedVolume'
  | 'unitWithFixedWeight'
  | 'unitWithVariableWeight'
  | 'unitWithVariableVolume';

export type ProductRating = number;

export interface EcoStoreProduct extends BasePocketBaseEntityWithTenantRef {
  description?: LocalizedFields | string;
  inStock: boolean;
  stock: number;
  origin?: string;
  provider?: string;
  price: number;
  iva: number;
  priceWithIva: number;
  images?: string[];
  unitType: ProductUnitType;
  unitBase: number | null;
  category: ProductCategory['id'];
  minQuantity: number;
  maxQuantity: number;
  rating?: ProductRating;
  reviewCount?: number;
  features?: LocalizedFields[] | string[];
}

export type CreateEcoStoreProduct = Omit<
  EcoStoreProduct,
  'id' | 'created' | 'updated' | 'normalizedName' | 'client' | 'rating' | 'reviewCount'
>;

export type UpdateEcoStoreProduct = Partial<
  Omit<
    EcoStoreProduct,
    'id' | 'created' | 'updated' | 'normalizedName' | 'client' | 'rating' | 'reviewCount'
  >
> & { id: string };

export interface EcoStoreProductFilter {
  client?: string;
  name?: string;
  search?: string;
}

export type EcoStoreProductWithCategoryName = EcoStoreProduct & {
  name: string; // * Localized product name is processed by store
  description: string; // * Localized product description is processed by store
  features: string[]; // * Localized product features are processed by store
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
  categoryIcon?: string;
};
