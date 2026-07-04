import { FormConfig } from '@plastik/core/entities';

/**
 * @description Form config for the inline email-change request.
 * Blocks submit when the new email equals the current one.
 * @param {string} currentEmail The user's current email, to reject as a no-op.
 * @returns {FormConfig<{ email: string }>} The request form config.
 */
export function accessSecurityEmailFormConfig(currentEmail: string): FormConfig<{ email: string }> {
  const formConfig = [
    {
      fieldGroup: [
        {
          key: 'email',
          type: 'input',
          props: {
            label: 'profile.accessSecurity.email.label',
            placeholder: 'profile.accessSecurity.email.label',
            required: true,
            translate: true,
            type: 'email',
            attributes: { autocomplete: 'off' },
          },
          // Messages come from the registered Formly validationMessages ('email' from
          // registerValidatorsTranslateExtension, 'notCurrent' from this lib's extension) —
          // inline `message` fns would render the raw i18n key instead of translating it.
          validators: {
            notCurrent: {
              expression: (control: { value: string }) =>
                !control.value || control.value.trim().toLowerCase() !== currentEmail.toLowerCase(),
            },
            email: {
              expression: (control: { value: string }) =>
                !control.value || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(control.value),
            },
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'profile.accessSecurity.submitButton',
      buttonStyle:
        'w-full md:w-auto mt-6 py-3 px-8 text-sys-on-primary bg-primary font-bold tracking-wide rounded-2xl shadow-md border-0',
    }),
  };
}
