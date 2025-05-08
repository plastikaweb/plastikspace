/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/search';

export function getLlecoopCategorySearchFeatureFormConfig(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'flex flex-col md:flex-row flex-wrap gap-sm',
      fieldGroup: [addSearchInput({ label: 'Filtrar per nom', placeholder: 'Filtrar per nom' })],
    },
  ];
}
