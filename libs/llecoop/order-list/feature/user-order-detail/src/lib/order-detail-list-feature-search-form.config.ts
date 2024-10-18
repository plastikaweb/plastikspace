/* eslint-disable jsdoc/require-jsdoc */
import { signal, WritableSignal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { addSearchInput } from '@plastik/shared/form/ui';

export function getLlecoopOrderDetailListSearchFeatureFormConfig(): WritableSignal<
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
