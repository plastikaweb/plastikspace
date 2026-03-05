import { Pipe, PipeTransform } from '@angular/core';
import { LlecoopProductUnit } from '@plastik/llecoop/entities';

@Pipe({
  name: 'llecoopProductBaseUnitText',
})
export class LlecoopProductBaseUnitTextPipe implements PipeTransform {
  transform(value: LlecoopProductUnit): string {
    if (!value || typeof value !== 'object' || !('type' in value)) {
      throw new Error(
        'Invalid input: LlecoopProductBaseUnitTextPipe expects a LlecoopProductUnit object'
      );
    }

    return getLlecoopProductBasedUnitText(value);
  }
}

/**
 * @description Returns a text description based on the type of LlecoopProductUnit.
 * @param {LlecoopProductUnit} unit - The unit object to get the description for.
 * @returns {string} - The text description of the unit.
 */
function getLlecoopProductBasedUnitText(unit: LlecoopProductUnit): string {
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
