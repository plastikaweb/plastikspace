import { Observable, of } from 'rxjs';

/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/search';
import { DatepickerProps } from '@plastik/shared/form/year-picker';

export function getNasaImagesSearchFeatureFormConfig(): Observable<FormlyFieldConfig[]> {
  return of([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row gap-sm',
      fieldGroup: [
        addSearchInput(
          { label: 'Search by term', placeholder: 'Search by term', required: true },
          'q'
        ),
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
              } as DatepickerProps,
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
              } as DatepickerProps,
            },
          ],
        },
      ],
    },
  ]);
}
