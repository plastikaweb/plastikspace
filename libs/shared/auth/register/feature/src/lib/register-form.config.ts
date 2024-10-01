/* eslint-disable jsdoc/require-jsdoc */
import { signal, WritableSignal } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export function getRegisterFormConfig(): WritableSignal<FormlyFieldConfig[]> {
  return signal([
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
  ]);
}
