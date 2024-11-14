/* eslint-disable jsdoc/require-jsdoc */
import { signal, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/ui';

export function getLlecoopProductSearchFeatureFormConfig(): Signal<FormlyFieldConfig[]> {
  return signal([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sm',
      fieldGroup: [
        addSearchInput('Filtrar per nom, categoria, descripció', 'buidar valor'),
        {
          key: 'inStock',
          type: 'select',
          defaultValue: 'all',
          className: 'w-full md:w-1/2',
          templateOptions: {
            label: 'Disponibilitat',
            placeholder: 'Disponibilitat',
            required: false,
            options: [
              { label: 'Tots', value: 'all' },
              { label: 'Disponible', value: 'available' },
              { label: 'No disponible', value: 'not-available' },
            ],
          },
        },
      ],
    },
  ]);
}
