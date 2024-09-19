import { AbstractControl } from '@angular/forms';

/**
 * Validator function to check if the password meets the required criteria.
 * @param {AbstractControl} control - The form control containing the password.
 * @returns {null | object} - Returns null if the password is valid, otherwise returns an object with the error.
 */
export function passwordValidator(control: AbstractControl) {
  console.log('control.value', control.value);
  if (!control.value || isValidPassword(control.value)) {
    return null;
  }
  return { password: true };
}

/**
 * Checks if the password meets the required criteria.
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 */
function isValidPassword(password: string): boolean {
  if (!password) {
    return false;
  }
  if (password.length < 8) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  // noinspection RedundantIfStatementJS
  if (!/\d/.test(password)) {
    return false;
  }
  return true;
}
