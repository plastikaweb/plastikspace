/* eslint-disable jsdoc/require-jsdoc */
import { Validators } from '@angular/forms';
import { FormConfig } from '@plastik/core/entities';

import { LoginData } from './register-facade.service';

export function registerFormConfig(): FormConfig<LoginData> {
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
    {
      key: 'password',
      type: 'password-with-visibility',
      props: {
        type: 'password',
        label: 'Contrasenya',
        placeholder: 'Contrasenya',
        required: true,
        minLength: 8,
        maxLength: 25,
        attributes: {
          autocomplete: 'off',
        },
      },
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'Enviar registre',
      buttonStyle: 'w-full sm:w-full',
    }),
  };
}
