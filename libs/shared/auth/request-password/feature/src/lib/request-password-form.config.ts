/* eslint-disable jsdoc/require-jsdoc */
import { signal, WritableSignal } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export function getRequestPasswordFormConfig(): WritableSignal<FormlyFieldConfig[]> {
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
  ]);
}
