import { Pipe, PipeTransform } from '@angular/core';
import { LlecoopProductUnit } from '@plastik/llecoop/entities';

@Pipe({
  name: 'llecoopProductUnitSuffix',
})
export class LlecoopProductUnitSuffixPipe implements PipeTransform {
  transform(value: LlecoopProductUnit): string {
    if (!value || typeof value !== 'object' || !('type' in value)) {
      throw new Error(
        'Invalid input: LlecoopProductUnitSuffixPipe expects a LlecoopProductUnit object'
      );
    }

    return getLlecoopProductUnitSuffix(value);
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
