import { BaseEntity } from '@plastik/core/entities';
import { LlecoopProductCategory } from './product-category';

export interface LlecoopProduct extends BaseEntity {
  price: number;
  iva: number;
  priceWithIva?: number;
  origin: string;
  info: string;
  category: LlecoopProductCategory;
  tags: string[];
  unit: 'kg' | 'l' | 'unitat';
  quantityInterval: number;
  available: boolean;
}
