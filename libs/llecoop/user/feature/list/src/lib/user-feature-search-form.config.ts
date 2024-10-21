/* eslint-disable jsdoc/require-jsdoc */
import { signal, WritableSignal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/ui';

export function getLlecoopUserSearchFeatureFormConfig(): WritableSignal<FormlyFieldConfig[]> {
  return signal([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row gap-sm md:gap-tiny',
      fieldGroup: [
        addSearchInput('Filtrar per correu electrònic', 'buidar valor'),
        {
          key: 'role',
          type: 'select',
          defaultValue: 'all',
          className: 'w-full md:w-1/2',
          templateOptions: {
            label: 'Rol',
            placeholder: 'Rol',
            required: false,
            options: [
              { label: 'Tots', value: 'all' },
              { label: 'Administrador', value: 'admin' },
              { label: 'Soci', value: 'soci' },
            ],
          },
        },
      ],
    },
  ]);
}
