import { BasePocketBaseEntityWithClientRef, LocalizedFields } from './base-pocketbase-entity';
import { ProductCategory } from './productCategory';

export type ProductUnitType =
  | 'unit'
  | 'weight'
  | 'volume'
  | 'unitWithFixedVolume'
  | 'unitWithFixedWeight'
  | 'unitWithVariableWeight'
  | 'unitWithVariableVolume';

/**
 * Rating del producte, valor decimal entre 0 i 5
 */
export type ProductRating = number;

// Tipus base de PocketBase
export interface Product extends BasePocketBaseEntityWithClientRef {
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
  rating?: ProductRating;
  reviewCount?: number;
}

export type CreateProduct = Omit<
  Product,
  'id' | 'created' | 'updated' | 'normalizedName' | 'client' | 'rating' | 'reviewCount'
>;

export type UpdateProduct = Partial<
  Omit<
    Product,
    'id' | 'created' | 'updated' | 'normalizedName' | 'client' | 'rating' | 'reviewCount'
  >
> & { id: string };

export interface ProductFilters {
  client?: string;
  name?: string;
  search?: string;
}
