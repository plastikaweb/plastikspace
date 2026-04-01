import { ResetPasswordData } from '@plastik/auth/entities';
import { FormConfig } from '@plastik/core/entities';

/**
 * @description Returns the Formly configuration for the password reset form.
 * @returns {FormConfig<ResetPasswordData>} The reset password form configuration.
 */
export function resetPasswordFormConfig(): FormConfig<ResetPasswordData> {
  const formConfig = [
    {
      fieldGroup: [
        {
          key: 'password',
          type: 'password-with-visibility',
          props: {
            label: 'auth.resetPassword.passwordLabel',
            placeholder: 'auth.resetPassword.passwordPlaceholder',
            required: true,
            translate: true,
            minLength: 8,
            maxLength: 25,
            attributes: {
              autocomplete: 'off',
            },
          },
          expressions: {
            'validation.show': 'true',
          },
        },
        {
          key: 'confirmPassword',
          type: 'password-with-visibility',
          props: {
            label: 'auth.resetPassword.passwordConfirmLabel',
            placeholder: 'auth.resetPassword.passwordConfirmPlaceholder',
            required: true,
            translate: true,
            attributes: {
              autocomplete: 'off',
            },
          },
          expressions: {
            'validation.show': 'true',
          },
        },
      ],
      validators: {
        validation: [{ name: 'passwordMatch', options: { errorPath: 'confirmPassword' } }],
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
