/* eslint-disable jsdoc/require-jsdoc */
import { Validators } from '@angular/forms';
import { FormConfig } from '@plastik/core/entities';
import { LoginData } from './login-facade.service';

export function loginFormConfig(): FormConfig<LoginData> {
  const formConfig = [
    {
      key: 'email',
      type: 'input',
      className: 'w-full',
      props: {
        type: 'email',
        label: 'Adreça electrònica',
        placeholder: 'Adreça electrònica',
        required: true,
      },
      validators: {
        validation: [Validators.email],
      },
    },
    {
      key: 'password',
      type: 'password-with-visibility',
      className: 'w-full',
      props: {
        type: 'password',
        label: 'Contrasenya',
        placeholder: 'Contrasenya',
        required: true,
        minLength: 8,
        maxLength: 25,
      },
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      label: 'Iniciar sessió',
      buttonStyle: 'w-full sm:w-full',
    }),
  };
}
