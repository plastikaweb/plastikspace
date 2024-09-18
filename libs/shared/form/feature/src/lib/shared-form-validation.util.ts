import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * @description Message for required validation error.
 * @returns {string} Return message.
 */
export function requiredValidationMessage(): string {
  return `This field is required`;
}

/**
 * @param { string } error The error message.
 * @param { FormlyFieldConfig } config The Formly field configuration object.
 * @description Message for min length validation error.
 * @returns { string } Return message.
 */
export function minLengthValidationMessage(error: string, config: FormlyFieldConfig): string {
  return `Minimum of ${config.props?.minLength} characters`;
}

/**
 * @param { string } error The error message.
 * @param { FormlyFieldConfig } config The Formly field configuration object.
 * @description Message for max length validation error.
 * @returns { string } Return message.
 */
export function maxLengthValidationMessage(error: string, config: FormlyFieldConfig): string {
  return `Maximum of ${config.props?.maxLength} characters`;
}

/**
 * @param { string } error The error message.
 * @param { FormlyFieldConfig } config The Formly field configuration object.
 * @description Message for min validation error.
 * @returns { string } Return message.
 */
export function minValidationMessage(error: string, config: FormlyFieldConfig): string {
  return `Min value ${config.props?.min}`;
}

/**
 * @param { string } error The error message.
 * @param { FormlyFieldConfig } config The Formly field configuration object.
 * @description Message for max validation error.
 * @returns { string } Return message.
 */
export function maxValidationMessage(error: string, config: FormlyFieldConfig): string {
  return `Max value ${config.props?.max}`;
}
