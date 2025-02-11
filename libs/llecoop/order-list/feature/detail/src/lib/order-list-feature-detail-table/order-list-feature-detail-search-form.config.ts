/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/search';

export function getLlecoopOrderListFeatureDetailSearchFormConfig(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'flex flex-col md:flex-row flex-wrap gap-sm',
      fieldGroup: [
        addSearchInput({
          label: 'Filtrar per nom o adreça',
          placeholder: 'Filtrar per nom o adreça',
        }),
      ],
    },
  ];
}
