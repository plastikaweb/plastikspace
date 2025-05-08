/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/search';

export function getLlecoopUserSearchFeatureFormConfig(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sm',
      fieldGroup: [
        addSearchInput(
          {
            label: 'Filtrar per nom',
            placeholder: 'Filtrar per nom',
          },
          'name'
        ),
        addSearchInput(
          {
            label: 'Filtrar per correu electrònic',
            placeholder: 'Filtrar per correu electrònic',
          },
          'email'
        ),
        {
          key: 'role',
          type: 'select',
          defaultValue: 'all',
          className: 'w-full md:w-1/2',
          props: {
            label: 'Rol',
            placeholder: 'Rol',
            required: false,
            options: [
              { label: 'Tots', value: 'all' },
              { label: 'Administrador', value: 'admin' },
              { label: 'Soci', value: 'user' },
            ],
          },
        },
      ],
    },
  ];
}
