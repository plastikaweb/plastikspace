import { AbstractControl } from '@angular/forms';

/**
 * Where the two passwords live in the value of the group. The keys of the profile form when left out.
 */
export interface PasswordMatchOptions {
  /** The key of the password. `newPassword` when left out. */
  passwordKey?: string;
  /** The key of the repeated password. `confirmPassword` when left out. */
  confirmKey?: string;
}

/**
 * Validator to check if the password and its repetition match.
 * @param {AbstractControl} control - The form control containing both fields.
 * @param {unknown} [_field] - The Formly field, which this validator does not read.
 * @param {PasswordMatchOptions} [options] - Where the two passwords live in the value of the control.
 * @returns {null | object} - Returns null if the passwords match or are empty, otherwise returns an object with a passwordMatch property set to true.
 */
export function passwordMatchValidator(
  control: AbstractControl,
  _field?: unknown,
  options?: PasswordMatchOptions
) {
  const value: Record<string, unknown> = control.value ?? {};
  const password = value[options?.passwordKey ?? 'newPassword'];
  const confirmPassword = value[options?.confirmKey ?? 'confirmPassword'];

  if (!confirmPassword || !password) {
    return null;
  }

  if (confirmPassword === password) {
    return null;
  }

  return { passwordMatch: true };
}
