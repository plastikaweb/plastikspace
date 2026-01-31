import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { filter, tap } from 'rxjs';

export type HookFunction = {
  fn: (field: FormlyFieldConfig, linkedFieldKeys: string[]) => void;
  linkedFieldKeys: string[];
};

/**
 * Checks validation status of linked form controls and updates custom label validation state.
 * @param field - Formly field configuration
 * @param linkedFieldKeys - Array of field keys to check validation against
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
 * Updates custom label value based on shipping method (pickup/delivery).
 * @param field - Formly field configuration
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
 * Generates shipping label based on available shipping methods.
 * @param field - Field name for label generation
 * @param availableMethodTypes - Array of available shipping method types
 * @returns Translated label key for the shipping field
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
 * Creates a custom label field configuration with validation hooks.
 * @param key - Field key identifier
 * @param icon - Material icon name
 * @param availableMethodTypes - Array of available shipping method types
 * @param hooks - Array of hook functions to execute
 * @param isValid - Initial validation state
 * @returns Partial Formly field configuration for custom label
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

/**
 * Checks if slots should be hidden based on tiers/instructions configuration.
 * @param field - Formly field configuration
 * @param getTiersOrInstructions - Function to retrieve tiers or instructions configuration
 * @returns True if slots should be hidden, false otherwise
 */
export function shouldHideSlots(
  field: FormlyFieldConfig,
  getTiersOrInstructions: (method?: unknown, addressId?: string | null) => { type: string } | null
): boolean {
  const method = field.model?.method ?? 'pickup';
  const addressId = field.model?.address?.id;
  const tiersOrInstructions = getTiersOrInstructions(method, addressId);

  // If no tiersOrInstructions config, hide slots (show instructions by default)
  if (!tiersOrInstructions) return true;

  return tiersOrInstructions.type !== 'slots';
}

/**
 * Gets instructions text from tiers/instructions configuration.
 * @param field - Formly field configuration
 * @param getTiersOrInstructions - Function to retrieve tiers or instructions configuration
 * @returns Instructions text or empty string
 */
export function getInstructionsText(
  field: FormlyFieldConfig,
  getTiersOrInstructions: (
    method?: unknown,
    addressId?: string | null
  ) => { type: string; instructions?: string } | null
): string {
  const method = field.model?.method ?? 'pickup';
  const addressId = field.model?.address?.id;
  const tiersOrInstructions = getTiersOrInstructions(method, addressId);
  return tiersOrInstructions?.instructions || '';
}
