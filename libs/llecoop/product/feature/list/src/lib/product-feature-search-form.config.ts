/* eslint-disable jsdoc/require-jsdoc */
import { signal, WritableSignal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/ui';

export function getLlecoopProductSearchFeatureFormConfig(): WritableSignal<FormlyFieldConfig[]> {
  return signal([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row flex-wrap gap-sm',
      fieldGroup: [
        addSearchInput('Filtrar per nom, descripció, procedència o proveïdor', 'buidar valor'),
        // {
        //   key: 'category',
        //   type: 'select',
        //   defaultValue: '',
        //   className: 'w-full md:w-1/2',
        //   templateOptions: {
        //     label: 'Categories',
        //     placeholder: 'Categories',
        //     required: false,
        //     options: [],
        //   },
        // },
        // {
        //   key: 'inStock',
        //   type: 'select',
        //   defaultValue: '',
        //   className: 'w-full md:w-1/2',
        //   templateOptions: {
        //     label: 'Disponibilitat',
        //     placeholder: 'Disponibilitat',
        //     required: false,
        //     options: [
        //       { label: 'Tots', value: '' },
        //       { label: 'Disponible', value: 'true' },
        //       { label: 'No disponible', value: 'false' },
        //     ],
        //   },
        // }
      ],
    },
  ]);
}
