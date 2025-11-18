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

export type ProductRating = 0 | 1 | 2 | 3 | 4 | 5;

// Tipus base de PocketBase
export interface Product extends BasePocketBaseEntityWithClientRef {
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
  description?: LocalizedFields | string;
  categoryId: ProductCategory['id'];
  categoryName: ProductCategory['name'];
  rating?: ProductRating;
  reviewCount?: number;
}

export type CreateProduct = Omit<
  Product,
  'id' | 'created' | 'updated' | 'normalizedName' | 'clientId' | 'rating' | 'reviewCount'
>;

export type UpdateProduct = Partial<
  Omit<
    Product,
    'id' | 'created' | 'updated' | 'normalizedName' | 'clientId' | 'rating' | 'reviewCount'
  >
> & { id: string };

export interface ProductFilters {
  clientId?: string;
  name?: string;
  search?: string;
}
