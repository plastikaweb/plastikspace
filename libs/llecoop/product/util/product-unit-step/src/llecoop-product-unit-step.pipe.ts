import { Pipe, PipeTransform } from '@angular/core';
import { LlecoopProductUnit } from '@plastik/llecoop/entities';

@Pipe({
  name: 'llecoopProductUnitStep',
})
export class LlecoopProductUnitStepPipe implements PipeTransform {
  transform(value: LlecoopProductUnit): number {
    if (!value || typeof value !== 'object' || !('type' in value)) {
      throw new Error(
        'Invalid input: LlecoopProductUnitStepPipe expects a LlecoopProductUnit object'
      );
    }

    return getLlecoopProductUnitStep(value);
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
      return 0.1;
    default:
      return 1.0;
  }
}
