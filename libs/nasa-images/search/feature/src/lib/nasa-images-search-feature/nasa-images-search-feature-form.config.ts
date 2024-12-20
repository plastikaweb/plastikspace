/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/search';
import { Observable, of } from 'rxjs';

export function getNasaImagesSearchFeatureFormConfig(): Observable<FormlyFieldConfig[]> {
  return of([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row gap-sm',
      fieldGroup: [
        addSearchInput('Search by term', 'Reset search', 'q'),
        {
          fieldGroupClassName: 'flex flex-col md:flex-row gap-sm justify-start',
          fieldGroup: [
            {
              key: 'year_start',
              type: 'year-picker',
              className: 'w-fit',
              props: {
                label: 'Start year',
                placeholder: 'YYYY',
                required: true,
                startView: 'multi-year',
              },
            },
            {
              key: 'year_end',
              type: 'year-picker',
              className: 'w-fit',
              props: {
                label: 'End year',
                placeholder: 'YYYY',
                required: true,
                startView: 'multi-year',
              },
            },
          ],
        },
      ],
    },
  ]);
}
