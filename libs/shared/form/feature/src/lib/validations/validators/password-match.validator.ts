import { AbstractControl } from '@angular/forms';

/**
 * Validator to check if the new password and confirm password fields match.
 * @param {AbstractControl} control - The form control containing the newPassword and confirmPassword fields.
 * @returns {null | object} - Returns null if the passwords match or are empty, otherwise returns an object with a passwordMatch property set to true.
 */
export function passwordMatchValidator(control: AbstractControl) {
  const { newPassword, confirmPassword } = control.value;
  if (!confirmPassword || !newPassword) {
    return null;
  }

  if (confirmPassword === newPassword) {
    return null;
  }

  // eslint-disable-next-line
  return { passwordMatch: true };
}
