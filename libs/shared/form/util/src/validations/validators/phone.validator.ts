import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validator function to check if the control's value is a valid phone number.
 * @param {AbstractControl} control - The form control to validate.
 * @returns {null | object} - Returns null if valid, otherwise an object with the error.
 */
export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const phoneRegex = /^[6-9]\d{8}$/;
  return !control.value || phoneRegex.test(control.value) ? null : { phone: true };
}
