/* eslint-disable jsdoc/require-jsdoc */
import { Validators } from '@angular/forms';
import { FormConfig } from '@plastik/core/entities';
import { LoginData } from './register-facade.service';

export function registerFormConfig(): FormConfig<LoginData> {
  const formConfig = [
    {
      key: 'email',
      type: 'input',
      className: 'w-full',
      templateOptions: {
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
      templateOptions: {
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
      label: 'Enviar registre',
      buttonStyle: 'w-full sm:w-full',
    }),
  };
}
