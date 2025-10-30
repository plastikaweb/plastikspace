import { BasePocketBaseEntity } from './base-pocketbase-entity';
import { ProductCategory } from './productCategory';

export type ProductUnitType =
  | 'unit'
  | 'weight'
  | 'unitWithFixedVolume'
  | 'unitWithFixedWeight'
  | 'unitWithVariableWeight'
  | 'unitWithVariableVolume';

// Tipus base de PocketBase
export interface Product extends BasePocketBaseEntity {
  isAvailable: boolean;
  stock: number;
  origin: string;
  provider: string;
  price: number;
  iva: number;
  priceWithIva: number;
  images: string[];
  unitType: ProductUnitType;
  unitBase: number | null;
  categoryId: ProductCategory['id'];
  categoryName: ProductCategory['name'];
}

export interface CreateProduct {
  name: string;
  isAvailable: boolean;
  stock: number;
  origin: string;
  provider: string;
  price: number;
  iva: number;
  priceWithIva: number;
  images: string[];
  unitType: ProductUnitType;
  unitBase: number | null;
  categoryId: ProductCategory['id'];
}

export interface UpdateProduct {
  name?: string;
  isAvailable?: boolean;
  stock?: number;
  origin?: string;
  provider?: string;
  price?: number;
  iva?: number;
  priceWithIva?: number;
  images?: string[];
  unitType?: ProductUnitType;
  unitBase?: number | null;
  categoryId?: ProductCategory['id'];
}
