/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/ui';
import { Observable, of } from 'rxjs';

export function getNasaImagesSearchFeatureFormConfig(): Observable<FormlyFieldConfig[]> {
  return of([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row flex-wrap gap-sm',
      fieldGroup: [
        addSearchInput('Search by term', 'Reset search', 'q'),
        {
          fieldGroupClassName: 'flex flex-row flex-wrap gap-sm',
          fieldGroup: [
            {
              key: 'year_start',
              type: 'year-picker',
              className: 'w-[180px]',
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
              className: 'w-[180px]',
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
