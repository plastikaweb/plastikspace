/* eslint-disable jsdoc/require-jsdoc */
import { signal, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/search';

export function getLlecoopUserOrderDetailListSearchFeatureFormConfig(): Signal<
  FormlyFieldConfig[]
> {
  return signal([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row flex-wrap gap-sm',
      fieldGroup: [
        addSearchInput('Filtrar per nom, descripció, procedència o proveïdor', 'buidar valor'),
      ],
    },
  ]);
}
