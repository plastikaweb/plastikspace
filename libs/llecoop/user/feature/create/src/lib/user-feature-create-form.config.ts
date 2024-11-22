/* eslint-disable jsdoc/require-jsdoc */
import { Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfig } from '@plastik/core/entities';
import { LlecoopUser } from '@plastik/llecoop/entities';

const getLlecoopUserCreateFormConfig: FormlyFieldConfig[] = [
  {
    fieldGroupClassName: 'flex flex-row flex-wrap gap-sm',
    fieldGroup: [
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
    ],
  },
];

export function userFeatureCreateFormConfig(): FormConfig<LlecoopUser> {
  return {
    getConfig: () => getLlecoopUserCreateFormConfig,
    getSubmitFormConfig: () => ({
      label: 'Afegir usuari',
    }),
  };
}
