import { DocumentReference } from '@angular/fire/firestore';
import { BaseEntity } from '@plastik/core/entities';

import { LlecoopProductCategory } from './product-category';

export interface LlecoopBaseProduct extends BaseEntity {
  info?: string;
  price: number;
  iva: number;
  priceWithIva: number;
  origin?: string;
  provider?: string;
  categoryRef: DocumentReference<LlecoopProductCategory>;
  category?: LlecoopProductCategory;
  categoryName?: string;
  unit: LlecoopProductUnit;
  tags?: string[];
  imgUrl?: string;
}

export interface LlecoopProduct extends LlecoopBaseProduct {
  isAvailable: boolean;
  stock?: number;
}

export interface LlecoopProductWithQuantity extends LlecoopProduct {
  quantity: number;
}

export type LlecoopProductUnit =
  | {
      type: 'unit';
    }
  | {
      type: 'weight';
    }
  | {
      type: 'unitWithFixedVolume';
      base: number;
    }
  | {
      type: 'unitWithFixedWeight';
      base: number;
    }
  | {
      type: 'unitWithVariableWeight';
      base: number;
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
    label: 'pes exacte (kg)',
    value: 'weight',
  },
  {
    label: 'unitat amb volum fix (l)',
    value: 'unitWithFixedVolume',
  },
  {
    label: 'unitat amb pes fix (kg)',
    value: 'unitWithFixedWeight',
  },
  {
    label: 'unitat amb pes variable (kg)',
    value: 'unitWithVariableWeight',
  },
] as const;
