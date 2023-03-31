import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { map, Observable } from 'rxjs';

// eslint-disable-next-line jsdoc/require-jsdoc
export function getNasaImagesSearchFeatureFormConfig(): Observable<FormlyFieldConfig[]> {
  return inject(Store)
    .select(selectRouteQueryParams)
    .pipe(
      map(params => (params as NasaImagesSearchApiParams)?.['q'] || ''),
      map(defaultValue => {
        return [
          {
            key: 'q',
            type: 'input',
            defaultValue,
            modelOptions: {
              debounce: {
                default: 400,
              },
            },
            hooks: {
              onChanges: (field: FormlyFieldConfig) => {
                const classes = field.defaultValue ? 'text-primary-dark' : 'text-primary-dark invisible';
                const addonRight = { ...field.props?.['addonRight'], classes };
                field.props = { ...field.props, addonRight };
              },
            },
            props: {
              type: 'search',
              label: 'Search by term',
              placeholder: 'Search by term',
              required: false,
              maxLength: 256,
              addonLeft: {
                icon: 'search',
              },
              addonRight: {
                icon: 'cancel',
                onClick: (_: unknown, { resetModel }: FormlyFormOptions): void => {
                  if (resetModel) {
                    resetModel({ q: '' });
                  }
                },
              },
            },
          },
        ];
      }),
    );
}
