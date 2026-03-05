import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { filter, tap } from 'rxjs';

export type HookFunction = {
  fn: (field: FormlyFieldConfig, linkedFieldKeys: string[]) => void;
  linkedFieldKeys: string[];
};

/**
 * @description Checks validation status of linked form controls and updates custom label validation state.
 * @param {FormlyFieldConfig} field - Formly field configuration
 * @param {string[]} linkedFieldKeys - Array of field keys to check validation against
 */
export function checkCustomLabelValidation(
  field: FormlyFieldConfig,
  linkedFieldKeys: string[] = []
): void {
  const controls = linkedFieldKeys.map(key => field.form?.get(key)) as AbstractControl[];
  const isValid = controls.every(control => control?.valid);
  const isTouched = controls.every(control => control?.touched);
  if (field?.props) {
    field.props['isValid'] = isValid ? 'valid' : isTouched ? 'error' : 'untouched';
  }
}

/**
 * @description Updates custom label value based on shipping method (pickup/delivery).
 * @param {FormlyFieldConfig} field - Formly field configuration
 */
export function setCustomLabelValue(field: FormlyFieldConfig): void {
  const method = field.model?.method ?? 'pickup';
  if (field.props) {
    field.props['label'] =
      method === 'pickup'
        ? `cart.shipping.${field.props['key']}.pickup.title`
        : `cart.shipping.${field.props['key']}.delivery.title`;
  }
}

/**
 * @description Generates shipping label based on available shipping methods.
 * @param {string} field - Field name for label generation
 * @param {string[] | undefined} availableMethodTypes - Array of available shipping method types
 * @returns {string} Translated label key for the shipping field
 */
export function getShippingLabel(
  field: string,
  availableMethodTypes: string[] | undefined
): string {
  const hasDelivery = availableMethodTypes?.includes('delivery');
  const hasPickup = availableMethodTypes?.includes('pickup');

  if (!hasDelivery && hasPickup) {
    return `cart.shipping.${field}.pickup.description`;
  }

  if (hasDelivery && !hasPickup) {
    return `cart.shipping.${field}.delivery.description`;
  }

  return `cart.shipping.${field}.all.description`;
}

/**
 * @description Creates a custom label field configuration with validation hooks.
 * @param {string} key - Field key identifier
 * @param {string} icon - Material icon name
 * @param {string[] | undefined} availableMethodTypes - Array of available shipping method types
 * @param {HookFunction[]} hooks - Array of hook functions to execute
 * @param {'valid' | 'error' | 'untouched'} isValid - Initial validation state
 * @returns {Partial<FormlyFieldConfig>} Partial Formly field configuration for custom label
 */
export function createCustomLabel(
  key: string,
  icon: string,
  availableMethodTypes: string[] | undefined,
  hooks: HookFunction[] = [],
  isValid: 'valid' | 'error' | 'untouched' = 'untouched'
): Partial<FormlyFieldConfig> {
  const allLinkedFieldKeys = Array.from(new Set(hooks.flatMap(h => h.linkedFieldKeys)));

  return {
    type: 'custom-label',
    className: 'flex flew-row items-start text-primary-600 mt-4',
    props: {
      key,
      label: getShippingLabel(key, availableMethodTypes),
      icon,
      containerClasses: 'p-2',
      iconClasses: 'scale-125',
      checkValidation: true,
      isValid,
    },
    hooks: {
      onInit: (field: FormlyFieldConfig) => {
        const hookFunction = () => {
          hooks.forEach(({ fn, linkedFieldKeys }) => fn(field, linkedFieldKeys));
        };

        hookFunction();

        return field.options?.fieldChanges?.pipe(
          filter(
            e => e.type === 'valueChanges' && allLinkedFieldKeys.includes(e.field?.key as string)
          ),
          tap(() => hookFunction())
        );
      },
    },
  };
}
