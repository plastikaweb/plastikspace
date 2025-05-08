import { tap } from 'rxjs';

import { FormlyFieldConfig } from '@ngx-formly/core';
import { AddonConfig } from '@plastik/shared/form/util';

/**
 * Creates a Formly field configuration for a search input field.
 * @param {Partial<FormlyFieldConfig['props']>} customProps - Additional properties to be merged with the default field configuration.
 * @param {string} key - The key for the form control.
 * @param {string} className - The CSS class name for the field.
 * @param {string} defaultValue - The default value for the form control.
 * @description Returns a Formly field configuration object with the specified label, cancel label, and key.
 * The configuration includes a search input field with a debounce model option,
 * and an addon right element with a cancel icon that resets the form control when clicked.
 * @returns {FormlyFieldConfig} The Formly field configuration object.
 */
export function addSearchInput(
  customProps: Partial<FormlyFieldConfig['props']> = {},
  key = 'text',
  className = 'w-full',
  defaultValue = ''
): FormlyFieldConfig {
  return {
    key,
    type: 'input',
    defaultValue,
    modelOptions: {
      debounce: {
        default: 300,
      },
    },
    hooks: {
      onInit: config => config.form?.valueChanges.pipe(tap(() => setAddOnRightVisibility(config))),
      onChanges: setAddOnRightVisibility,
    },
    className,
    props: {
      type: 'search',
      label: 'Search',
      placeholder: 'Search',
      required: false,
      maxLength: 256,
      minLength: 1,
      addonLeft: {
        icon: 'search',
        aria: 'search',
        ariaHidden: true,
        type: 'icon',
      } as AddonConfig,
      addonRight: {
        icon: 'cancel',
        aria: 'empty value',
        type: 'button',
        onClick: (field: FormlyFieldConfig): void => field.formControl?.setValue(''),
      } as AddonConfig,
      attributes: {
        autocomplete: 'off',
      },
      ...customProps,
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
