import { ConfirmEmailChangeData } from '@plastik/auth/entities';
import { FormConfig } from '@plastik/core/entities';

/**
 * @description Form config for the public email-change confirmation page.
 * @returns {FormConfig<Pick<ConfirmEmailChangeData, 'password'>>} The confirm form config.
 */
export function confirmEmailChangeFormConfig(): FormConfig<
  Pick<ConfirmEmailChangeData, 'password'>
> {
  const formConfig = [
    {
      fieldGroup: [
        {
          key: 'password',
          type: 'password-with-visibility',
          props: {
            label: 'auth.confirmEmailChange.passwordLabel',
            placeholder: 'auth.confirmEmailChange.passwordLabel',
            required: true,
            translate: true,
            attributes: { autocomplete: 'current-password' },
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'auth.confirmEmailChange.submitButton',
      buttonStyle:
        'w-full md:w-auto mt-6 py-3 px-8 text-sys-on-primary bg-primary font-bold tracking-wide rounded-2xl shadow-md border-0',
    }),
  };
}
