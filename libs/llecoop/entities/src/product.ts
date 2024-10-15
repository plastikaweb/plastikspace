import { DocumentReference } from '@angular/fire/firestore';
import { BaseEntity } from '@plastik/core/entities';
import { LlecoopProductCategory } from './product-category';

export interface LlecoopBaseProduct extends BaseEntity {
  info?: string;
  price: number;
  iva: number;
  priceWithIva?: number;
  origin?: string;
  provider?: string;
  categoryRef: DocumentReference<LlecoopProductCategory>;
  category?: LlecoopProductCategory;
  tags?: string[];
  unit: LlecoopProductUnit;
}
export interface LlecoopProduct extends LlecoopBaseProduct {
  isAvailable: boolean;
  stock?: number;
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

export interface LlecoopProductWithUpdateNotification {
  product: Partial<LlecoopProduct>;
  showNotification: boolean;
}

/**
 * @description Returns a text description based on the type of LlecoopProductUnit.
 * @param {LlecoopProductUnit} unit - The unit object to get the description for.
 * @returns {string} - The text description of the unit.
 */
export function getLlecoopProductBasedUnitText(unit: LlecoopProductUnit): string {
  switch (unit.type) {
    case 'unit':
      return 'unitat';
    case 'weight':
      return 'per kg';
    case 'unitWithFixedVolume':
      return `${unit.base} l unitat`;
    case 'unitWithFixedWeight':
      return `${unit.base} kg unitat`;
    case 'unitWithVariableWeight':
      return `${unit.base} kg per unitat. Pes aproximat`;
    default:
      return 'per unitat';
  }
}

/**
 * @description Returns the base value for a given LlecoopProductUnit.
 * @param {LlecoopProductUnit} unit - The unit object to get the base value for.
 * @returns {number} - The base value of the unit.
 */
export function getLlecoopProductUnitStep(unit: LlecoopProductUnit): number {
  switch (unit.type) {
    case 'weight':
      return 0.01;
    default:
      return 1.0;
  }
}

/**
 * @description Returns the suffix for a given LlecoopProductUnit.
 * @param {LlecoopProductUnit} unit - The unit object to get the suffix for.
 * @returns {string} - The suffix of the unit.
 */
export function getLlecoopProductUnitSuffix(unit: LlecoopProductUnit): string {
  switch (unit.type) {
    case 'weight':
      return 'kg';
    default:
      return 'u';
  }
}
