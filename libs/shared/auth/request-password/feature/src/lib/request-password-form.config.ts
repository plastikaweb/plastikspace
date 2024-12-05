/* eslint-disable jsdoc/require-jsdoc */
import { Validators } from '@angular/forms';
import { FormConfig } from '@plastik/core/entities';
import { RequestPasswordData } from './request-password-facade.service';

export function requestPasswordFormConfig(): FormConfig<RequestPasswordData> {
  return {
    getConfig: () => [
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
    ],
    getSubmitFormConfig: () => ({
      label: 'Enviar requeriment de contrasenya',
      buttonStyle: 'w-full sm:w-full',
    }),
  };
}
