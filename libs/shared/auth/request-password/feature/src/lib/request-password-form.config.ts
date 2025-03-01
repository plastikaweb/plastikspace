/* eslint-disable jsdoc/require-jsdoc */
import { Validators } from '@angular/forms';
import { FormConfig } from '@plastik/core/entities';

import { RequestPasswordData } from './request-password-facade.service';

export function requestPasswordFormConfig(): FormConfig<RequestPasswordData> {
  const formConfig = [
    {
      key: 'email',
      type: 'input',
      props: {
        type: 'email',
        label: 'Adreça electrònica',
        placeholder: 'Adreça electrònica',
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
      label: 'Enviar requeriment de contrasenya',
      buttonStyle: 'w-full sm:w-full',
    }),
  };
}
