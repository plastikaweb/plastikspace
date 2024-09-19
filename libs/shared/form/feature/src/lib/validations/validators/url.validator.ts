import { AbstractControl } from '@angular/forms';

/**
 * Validator function to check if the control's value is a valid URL.
 * @param {AbstractControl} control - The form control to validate.
 * @returns {null | object} - Returns null if valid, otherwise an object with the validation error.
 */
export function urlValidator(control: AbstractControl) {
  const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
  return !control.value || urlRegex.test(control.value) ? null : { url: true };
}
