import { Validators } from '@angular/forms';
import { RequestPasswordData } from '@plastik/auth/entities';
import { FormConfig } from '@plastik/core/entities';

/**
 * @description Returns the Formly configuration for the "forgot password" form.
 * @returns {FormConfig<RequestPasswordData>} The request password form configuration.
 */
export function requestPasswordFormConfig(): FormConfig<RequestPasswordData> {
  const formConfig = [
    {
      key: 'email',
      type: 'input',
      props: {
        type: 'email',
        label: 'auth.forgotPassword.email',
        placeholder: 'auth.forgotPassword.email',
        translate: true,
        required: true,
        attributes: {
          autocomplete: 'off',
        },
      },
      validators: {
        validation: [Validators.email],
      },
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      type: 'button',
      label: 'auth.forgotPassword.submit',
      buttonStyle: 'w-full sm:w-full',
      disableOnSubmit: true,
    }),
  };
}
