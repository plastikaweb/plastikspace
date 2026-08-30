import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validator function to check if the control's value is a valid Spanish postal code (código postal).
 * @param {AbstractControl} control - The form control to validate.
 * @returns {null | object} - Returns null if valid, otherwise an object with the error.
 */
export function zipValidator(control: AbstractControl): ValidationErrors | null {
  const zipRegex = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;

  return !control.value || zipRegex.test(control.value) ? null : { zip: true };
}
