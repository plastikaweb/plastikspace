import { BaseEntity } from '@plastik/core/entities';
import { LlecoopProductCategory } from './product-category';

export interface LlecoopProduct extends BaseEntity {
  description: string;
  price: number;
  iva: number;
  priceWithIva?: number;
  origin?: string;
  provider?: string;
  category: LlecoopProductCategory;
  tags?: string[];
  unit: LlecoopProductUnit;
  inStock: boolean;
}

export type LlecoopProductUnit =
  | {
      type: 'unit';
    }
  | {
      type: 'weight';
    }
  | {
      type: 'unitWithVariableWeight';
      baseWeight?: number;
    };

type LlecoopProductSelectOption = {
  label: string;
  value: LlecoopProductUnit['type'];
};

export const LlecoopProductSelectData: LlecoopProductSelectOption[] = [
  {
    label: 'unitat',
    value: 'unit',
  },
  {
    label: 'pes',
    value: 'weight',
  },
  {
    label: 'unitat amb pes variable',
    value: 'unitWithVariableWeight',
  },
] as const;
