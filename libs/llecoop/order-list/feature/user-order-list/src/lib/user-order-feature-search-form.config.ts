/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { llecoopUserOrderStatusOptions } from '@plastik/llecoop/entities';
import { addSearchInput } from '@plastik/shared/form/search';

export function getLlecoopUserOrderSearchFeatureFormConfig(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sm',
      fieldGroup: [
        addSearchInput({
          label: 'Filtrar per comanda setmanal',
          placeholder: 'Filtrar per comanda setmanal',
        }),
        {
          key: 'status',
          type: 'select',
          className: 'w-full',
          defaultValue: '',
          props: {
            label: 'Filtrar per estat',
            placeholder: 'Filtrar per estat',
            options: [{ value: '', label: 'Tots' }, ...llecoopUserOrderStatusOptions],
          },
        },
      ],
    },
  ];
}
