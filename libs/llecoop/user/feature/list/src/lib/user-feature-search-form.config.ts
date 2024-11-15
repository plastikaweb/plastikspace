/* eslint-disable jsdoc/require-jsdoc */
import { signal, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/ui';

export function getLlecoopUserSearchFeatureFormConfig(): Signal<FormlyFieldConfig[]> {
  return signal([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sm',
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
