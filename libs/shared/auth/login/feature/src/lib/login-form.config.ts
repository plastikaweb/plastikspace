/* eslint-disable jsdoc/require-jsdoc */
import { Validators } from '@angular/forms';
import { LoginData } from '@plastik/auth/entities';
import { FormConfig } from '@plastik/core/entities';

export function loginFormConfig(): FormConfig<LoginData> {
  const formConfig = [
    {
      fieldGroupClassName: 'flex flex-col gap-5',
      fieldGroup: [
        {
          key: 'email',
          type: 'input',
          props: {
            type: 'email',
            label: 'auth.login.email',
            placeholder: 'auth.login.email',
            translate: true,
            required: true,
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
            label: 'auth.login.password',
            placeholder: 'auth.login.password',
            translate: true,
            required: true,
            minLength: 8,
            maxLength: 25,
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => formConfig,
    getSubmitFormConfig: () => ({
      type: 'button',
      label: 'auth.login.submit',
      icon: 'login',
      buttonStyle: 'w-full sm:w-full',
      disableOnSubmit: true,
    }),
  };
}
