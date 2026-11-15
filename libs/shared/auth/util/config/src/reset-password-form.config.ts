import { FormlyFieldConfig } from '@ngx-formly/core';
import { ResetPasswordData } from '@plastik/auth/entities';
import { FormConfig } from '@plastik/core/entities';

import { FIELD_GROUP_CLASSES, FieldProps, passwordField } from './auth-form-fields';

/**
 * What an app may change in the form that sets a new password: how the fields look, never which
 * fields there are or what they ask for.
 *
 * Each set of props is laid over the defaults key by key, and a key set to `undefined` takes the
 * default away. A longer `maxLength` belongs in `fieldProps`: the second field must take whatever
 * the first one does.
 */
export interface ResetPasswordFormConfigOptions {
  /** Classes of the group that stacks the two fields. `FIELD_GROUP_CLASSES` when left out. */
  fieldGroupClassName?: string;
  /** Props for both fields. */
  fieldProps?: FieldProps;
  /** Props for the new password only, laid over `fieldProps`. */
  passwordProps?: FieldProps;
  /** Props for the repeated password only, laid over `fieldProps`. */
  confirmPasswordProps?: FieldProps;
}

/**
 * @description Returns the Formly configuration for the form that sets a new password, the same in every app unless it passes options.
 * Both fields are marked as a new password, so a password manager offers to make one and to save it.
 * The group checks that the two fields hold the same text, and shows the error under the second one.
 * @param {ResetPasswordFormConfigOptions} options What the app changes in the look of the fields.
 * @returns {FormConfig<ResetPasswordData>} The reset password form configuration.
 */
export function resetPasswordFormConfig(
  options: ResetPasswordFormConfigOptions = {}
): FormConfig<ResetPasswordData> {
  const formConfig: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: options.fieldGroupClassName ?? FIELD_GROUP_CLASSES,
      fieldGroup: [
        passwordField(
          {
            key: 'password',
            name: 'new-password',
            label: 'auth.resetPassword.passwordLabel',
            placeholder: 'auth.resetPassword.passwordPlaceholder',
            autocomplete: 'new-password',
          },
          { minLength: 8, maxLength: 25, description: 'auth.resetPassword.passwordHint' },
          options.fieldProps,
          options.passwordProps
        ),
        passwordField(
          {
            key: 'confirmPassword',
            name: 'new-password-repeat',
            label: 'auth.resetPassword.passwordConfirmLabel',
            placeholder: 'auth.resetPassword.passwordConfirmPlaceholder',
            autocomplete: 'new-password',
          },
          options.fieldProps,
          options.confirmPasswordProps
        ),
      ],
      validators: {
        validation: [
          {
            name: 'passwordMatch',
            options: { errorPath: 'confirmPassword', passwordKey: 'password' },
          },
        ],
      },
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'auth.resetPassword.submitButton',
      buttonStyle: 'w-full sm:w-full',
    }),
  };
}
