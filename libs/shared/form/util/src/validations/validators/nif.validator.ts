import { AbstractControl, ValidationErrors } from '@angular/forms';

const CIF_CONTROL_LETTERS = 'JABCDEFGHI';
const CIF_LETTER_ONLY_ORGS = 'NPQRSW';
const CIF_NUMBER_ONLY_ORGS = 'ABEH';

/**
 * Computes the CIF control digit for the 7 central digits of a CIF.
 * @param {string} digits - The 7 central digits of the CIF.
 * @returns {number} - The control digit (0-9).
 */
function cifControlDigit(digits: string): number {
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[i]);

    if (i % 2 === 0) {
      const doubled = digit * 2;

      sum += doubled > 9 ? Math.floor(doubled / 10) + (doubled % 10) : doubled;
    } else {
      sum += digit;
    }
  }

  return (10 - (sum % 10)) % 10;
}

/**
 * Validator function to check if the control's value is a valid Spanish tax ID (NIF/NIE/CIF).
 * Empty values are considered valid — pair with `required` when the field is mandatory.
 * @param {AbstractControl} control - The form control to validate.
 * @returns {null | object} - Returns null if valid, otherwise an object with the error.
 */
export function nifValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const value = String(control.value).trim().toUpperCase();
  const controlLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

  const dniMatch = /^(\d{8})([A-Z])$/.exec(value);

  if (dniMatch) {
    return controlLetters[Number(dniMatch[1]) % 23] === dniMatch[2] ? null : { nif: true };
  }

  const nieMatch = /^([KLMXYZ])(\d{7})([A-Z])$/.exec(value);

  if (nieMatch) {
    const niePrefix = { K: '0', L: '0', M: '0', X: '0', Y: '1', Z: '2' }[
      nieMatch[1] as 'K' | 'L' | 'M' | 'X' | 'Y' | 'Z'
    ];

    return controlLetters[Number(niePrefix + nieMatch[2]) % 23] === nieMatch[3]
      ? null
      : { nif: true };
  }

  const cifMatch = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/.exec(value);

  if (cifMatch) {
    const [, orgLetter, digits, controlChar] = cifMatch;
    const controlDigit = cifControlDigit(digits);
    const expectedLetter = CIF_CONTROL_LETTERS[controlDigit];
    const expectedNumber = String(controlDigit);

    if (CIF_LETTER_ONLY_ORGS.includes(orgLetter)) {
      return controlChar === expectedLetter ? null : { nif: true };
    }
    if (CIF_NUMBER_ONLY_ORGS.includes(orgLetter)) {
      return controlChar === expectedNumber ? null : { nif: true };
    }

    return controlChar === expectedLetter || controlChar === expectedNumber ? null : { nif: true };
  }

  return { nif: true };
}
