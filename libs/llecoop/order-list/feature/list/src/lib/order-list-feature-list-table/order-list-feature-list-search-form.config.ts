/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { llecoopOrderListStatusOptions } from '@plastik/llecoop/entities';
import { addSearchInput } from '@plastik/shared/form/search';

export function getLlecoopOrderListFeatureListSearchFormConfig(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'flex flex-col md:flex-row gap-0 md:gap-sm',
      fieldGroup: [
        addSearchInput({ label: 'Filtrar per nom', placeholder: 'Filtrar per nom' }),
        {
          key: 'status',
          type: 'select',
          className: 'w-full',
          defaultValue: '',
          props: {
            label: 'Filtrar per estat',
            placeholder: 'Filtrar per estat',
            options: [{ value: '', label: 'Tots' }, ...llecoopOrderListStatusOptions],
          },
        },
      ],
    },
  ];
}
