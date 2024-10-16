/* eslint-disable jsdoc/require-jsdoc */
import { signal, WritableSignal } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { tap } from 'rxjs';

function setAddOnRightVisibility(config: FormlyFieldConfig): void {
  const classes = config.formControl?.value ? 'text-primary-dark' : 'text-primary-dark invisible';
  const addonRight = { ...config.props?.['addonRight'], classes };
  config.props = { ...config.props, addonRight };
}

export function getLlecoopOrderDetailListSearchFeatureFormConfig(): WritableSignal<
  FormlyFieldConfig[]
> {
  return signal([
    {
      fieldGroupClassName: 'flex flex-col md:flex-row flex-wrap gap-sm',
      fieldGroup: [
        {
          key: 'text',
          type: 'input',
          defaultValue: '',
          modelOptions: {
            debounce: {
              default: 250,
            },
          },
          hooks: {
            onInit: config =>
              config.form?.valueChanges.pipe(tap(() => setAddOnRightVisibility(config))),
            onChanges: setAddOnRightVisibility,
          },
          className: 'w-full',
          props: {
            type: 'search',
            label: 'Filtrar per nom, descripció, procedència o proveïdor',
            placeholder: 'Filtrar per nom, descripció, procedència o proveïdor',
            required: false,
            maxLength: 256,
            minLength: 1,
            addonLeft: {
              icon: 'search',
            },
            addonRight: {
              icon: 'cancel',
              aria: 'buidar valor',
              onClick: (_: unknown, { resetModel }: FormlyFormOptions): void => {
                if (resetModel) {
                  resetModel({ text: '' });
                }
              },
            },
          },
        },
      ],
    },
  ]);
}
