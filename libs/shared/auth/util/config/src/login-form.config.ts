import { FormlyFieldConfig } from '@ngx-formly/core';
import { LoginData } from '@plastik/auth/entities';
import { FormConfig } from '@plastik/core/entities';

import { emailField, FIELD_GROUP_CLASSES, FieldProps, passwordField } from './auth-form-fields';

/**
 * What an app may change in the login form without writing the form again: how the fields look,
 * never which fields there are or what they ask for.
 *
 * Each set of props is laid over the defaults key by key, so a nested value such as `attributes`
 * is replaced whole. A key set to `undefined` takes the default away.
 */
export interface LoginFormConfigOptions {
  /** Classes of the group that stacks the two fields. `FIELD_GROUP_CLASSES` when left out. */
  fieldGroupClassName?: string;
  /** Props for both fields. */
  fieldProps?: FieldProps;
  /** Props for the address field only, laid over `fieldProps`. */
  emailProps?: FieldProps;
  /** Props for the password field only, laid over `fieldProps`. */
  passwordProps?: FieldProps;
}

/**
 * @description Returns the Formly configuration for the login form, the same in every app unless it passes options.
 * Both fields say what they hold (`name`, `autocomplete`), so a browser or a password manager can fill them.
 * @param {LoginFormConfigOptions} options What the app changes in the look of the fields.
 * @returns {FormConfig<LoginData>} The login form configuration.
 */
export function loginFormConfig(options: LoginFormConfigOptions = {}): FormConfig<LoginData> {
  const formConfig: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: options.fieldGroupClassName ?? FIELD_GROUP_CLASSES,
      fieldGroup: [
        emailField('auth.login.email', options.fieldProps, options.emailProps),
        passwordField(
          {
            key: 'password',
            name: 'password',
            label: 'auth.login.password',
            autocomplete: 'current-password',
          },
          { minLength: 8, maxLength: 25 },
          options.fieldProps,
          options.passwordProps
        ),
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      type: 'button',
      label: 'auth.login.submit',
      icon: 'login',
      buttonStyle: 'w-full sm:w-full',
      disableOnSubmit: true,
      alwaysEnabled: true,
    }),
  };
}
