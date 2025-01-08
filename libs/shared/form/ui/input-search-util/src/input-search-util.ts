import { tap } from 'rxjs';

import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Creates a Formly field configuration for a search input field.
 * @param {string} label - The label for the search input field.
 * @param {string} [cancelLabel] - The aria label for the cancel button.
 * @param {string} [key] - The key for the search input field.
 * @description Returns a Formly field configuration object with the specified label, cancel label, and key.
 * The configuration includes a search input field with a debounce model option,
 * and an addon right element with a cancel icon that resets the form control when clicked.
 * @returns {FormlyFieldConfig} The Formly field configuration object.
 */
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
        aria: label,
      },
      addonRight: {
        icon: 'cancel',
        aria: cancelLabel,
        onClick: (field: FormlyFieldConfig): void => field.formControl?.reset(),
      },
      attributes: {
        autocomplete: 'off',
      },
    },
  };
}

/**
 * Sets the visibility of the addon right element based on the form control's value.
 * @param {FormlyFieldConfig} config - The Formly field configuration object.
 * @description Modifies the addon right properties to add a 'classes' attribute that controls visibility.
 * When the form control has a value, the addon remains visible with 'text-primary-dark' class.
 * When the form control is empty, the addon becomes invisible by adding the 'invisible' class.
 */
function setAddOnRightVisibility(config: FormlyFieldConfig): void {
  const classes = config.formControl?.value ? 'text-primary-dark' : 'text-primary-dark invisible';
  const addonRight = { ...config.props?.['addonRight'], classes };
  config.props = { ...config.props, addonRight };
}
