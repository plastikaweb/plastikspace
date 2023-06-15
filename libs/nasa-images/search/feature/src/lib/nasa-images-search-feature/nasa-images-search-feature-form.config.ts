/* eslint-disable jsdoc/require-jsdoc */
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable, of, tap } from 'rxjs';

function setAddOnRightVisibility(config: FormlyFieldConfig): void {
  const classes = config.formControl?.value ? 'text-primary-dark' : 'text-primary-dark invisible';
  const addonRight = { ...config.props?.['addonRight'], classes };
  config.props = { ...config.props, addonRight };
}

export function getNasaImagesSearchFeatureFormConfig(): Observable<FormlyFieldConfig[]> {
  return of([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row flex-wrap gap-sm',
      fieldGroup: [
        {
          key: 'q',
          type: 'input',
          hooks: {
            onInit: config => config.form?.valueChanges.pipe(tap(() => setAddOnRightVisibility(config))),
            onChanges: setAddOnRightVisibility,
          },
          props: {
            type: 'search',
            label: 'Search by term',
            placeholder: 'Search by term',
            required: true,
            maxLength: 256,
            addonLeft: {
              icon: 'search',
            },
            addonRight: {
              icon: 'cancel',
              aria: 'Reset search',
              onClick: (_: unknown, { resetModel }: FormlyFormOptions): void => {
                if (resetModel) {
                  resetModel({ q: '' });
                }
              },
            },
          },
        },
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
