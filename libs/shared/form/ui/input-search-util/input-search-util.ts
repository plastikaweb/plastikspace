import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { tap } from 'rxjs';

export function addSearchInput(
  label: string,
  cancelLabel = 'empty value',
  key = 'text'
): FormlyFieldConfig {
  return {
    key,
    type: 'input',
    defaultValue: '',
    modelOptions: {
      debounce: {
        default: 250,
      },
    },
    hooks: {
      onInit: config => config.form?.valueChanges.pipe(tap(() => setAddOnRightVisibility(config))),
      onChanges: setAddOnRightVisibility,
    },
    className: 'w-full',
    props: {
      type: 'search',
      label,
      placeholder: label ?? 'Search',
      required: false,
      maxLength: 256,
      minLength: 1,
      addonLeft: {
        icon: 'search',
      },
      addonRight: {
        icon: 'cancel',
        aria: cancelLabel,
        onClick: (_: unknown, { resetModel }: FormlyFormOptions): void => {
          if (resetModel) {
            resetModel({ text: '' });
          }
        },
      },
    },
  };
}

function setAddOnRightVisibility(config: FormlyFieldConfig): void {
  const classes = config.formControl?.value ? 'text-primary-dark' : 'text-primary-dark invisible';
  const addonRight = { ...config.props?.['addonRight'], classes };
  config.props = { ...config.props, addonRight };
}
