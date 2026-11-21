import { FormlyFieldConfig } from '@ngx-formly/core';
import { RequestPasswordData } from '@plastik/auth/entities';
import { FormConfig } from '@plastik/core/entities';

import { emailField, FieldProps } from './auth-form-fields';

/**
 * What an app may change in the "forgot password" form: how its one field looks, never what it
 * asks for. The props are laid over the defaults key by key, and a key set to `undefined` takes
 * the default away.
 */
export interface RequestPasswordFormConfigOptions {
  /** Props for the address field. */
  fieldProps?: FieldProps;
}

/**
 * @description Returns the Formly configuration for the "forgot password" form, the same in every app unless it passes options.
 * The address field is the one of the login form, so a password manager offers the same address.
 * @param {RequestPasswordFormConfigOptions} options What the app changes in the look of the field.
 * @returns {FormConfig<RequestPasswordData>} The request password form configuration.
 */
export function requestPasswordFormConfig(
  options: RequestPasswordFormConfigOptions = {}
): FormConfig<RequestPasswordData> {
  const formConfig: FormlyFieldConfig[] = [
    emailField('auth.forgotPassword.email', options.fieldProps),
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      type: 'button',
      label: 'auth.forgotPassword.submit',
      buttonStyle: 'w-full sm:w-full',
      disableOnSubmit: true,
      alwaysEnabled: true,
    }),
  };
}
