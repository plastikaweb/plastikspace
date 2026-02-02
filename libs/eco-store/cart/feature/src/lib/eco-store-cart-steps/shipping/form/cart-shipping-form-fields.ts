import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { FormSelectOption } from '@plastik/core/entities';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreTenantLogisticsDeliveryType } from '@plastik/eco-store/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { ShippingMethodOption } from '@plastik/shared/form/shipping-method-selector';
import { filter, tap } from 'rxjs';
import {
  checkCustomLabelValidation,
  createCustomLabel,
  setCustomLabelValue,
} from './cart-shipping-form.utils';

export interface FieldDependencies {
  tenantStore: InstanceType<typeof ecoStoreTenantStore>;
  cartStore: InstanceType<typeof ecoStoreCartStore>;
  translateService: TranslateService;
  tenantAddresses: Array<{ default?: boolean; id: string }>;
  userAddresses: Array<{ default?: boolean; id: string }>;
  availableMethodTypes: string[] | undefined;
}

/**
 * Creates shipping method selector field.
 * @param { ShippingMethodOption[] } availableShippingMethodOptions - Array of available shipping method options
 * @param { string[] | undefined } availableMethodTypes - Array of available method type strings
 * @param { string } defaultValue - Default value for the method field
 * @returns { FormlyFieldConfig[] } Array of Formly field configurations for method selection
 */
export function createMethodField(
  availableShippingMethodOptions: ShippingMethodOption[],
  availableMethodTypes: string[] | undefined,
  defaultValue: string
): FormlyFieldConfig[] {
  return [
    createCustomLabel('method', 'counter_1', availableMethodTypes, [
      {
        fn: checkCustomLabelValidation,
        linkedFieldKeys: ['method'],
      },
    ]),
    {
      key: 'method',
      type: 'shipping-method-selector',
      defaultValue,
      props: {
        translate: true,
        required: true,
        shippingMethodOptions: availableShippingMethodOptions,
      },
    },
  ];
}

/**
 * Creates address selector field with dynamic address list based on method.
 * @param { FieldDependencies } deps - Field dependencies object
 * @param { unknown } defaultValue - Default value for the address field
 * @returns { FormlyFieldConfig[] } Array of Formly field configurations for address selection
 */
export function createAddressField(
  deps: FieldDependencies,
  defaultValue: unknown
): FormlyFieldConfig[] {
  const { tenantAddresses, userAddresses, availableMethodTypes, tenantStore, cartStore } = deps;

  return [
    createCustomLabel('address', 'counter_2', availableMethodTypes, [
      {
        fn: checkCustomLabelValidation,
        linkedFieldKeys: ['address'],
      },
      {
        fn: setCustomLabelValue,
        linkedFieldKeys: ['method'],
      },
    ]),
    {
      key: 'address',
      type: 'address-selector',
      defaultValue,
      props: {
        translate: true,
        required: true,
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          const getAddressesForMethod = (method: 'pickup' | 'delivery') =>
            method === 'pickup' ? tenantAddresses : userAddresses;

          const setDefaultAddress = (method: 'pickup' | 'delivery', shouldPreserveValue = true) => {
            const addresses = getAddressesForMethod(method);
            const defaultAddress = addresses.find(address => address.default);
            const shouldSetValue = shouldPreserveValue ? !field.formControl?.value : true;

            if (defaultAddress && shouldSetValue) {
              field.formControl?.setValue(defaultAddress);
              field.formControl?.updateValueAndValidity();
            }
          };

          const updateAddresses = (method: 'pickup' | 'delivery') => {
            if (field.props) {
              field.props['addresses'] = getAddressesForMethod(method);
            }
            setDefaultAddress(method, false);
          };

          const currentMethod = field.model?.method ?? 'pickup';
          if (field.props) {
            field.props['addresses'] = getAddressesForMethod(currentMethod);
          }
          setDefaultAddress(currentMethod);

          // Function to handle slot/instruction mode changes
          const handleSlotModeChange = () => {
            const method = field.model?.method;
            const addressId = field.model?.address?.id;
            if (!method) return;

            const tiersOrInstructions = tenantStore.getTiersOrInstructions(method, addressId);
            const hasSlots = tiersOrInstructions?.type === 'slots';

            if (!hasSlots) {
              // Instructions mode: reset day/time and set noDayAndTime to true
              cartStore.updateLogistics({
                day: null,
                time: null,
                noDayAndTime: true,
              });
            } else {
              // Slots mode: set noDayAndTime to false
              cartStore.updateLogistics({
                noDayAndTime: false,
              });
            }
          };

          // Handle initial state
          handleSlotModeChange();

          return field.options?.fieldChanges?.pipe(
            filter(
              e =>
                e.type === 'valueChanges' &&
                (e.field?.key === 'method' || e.field?.key === 'address')
            ),
            tap(({ value, field: changedField }) => {
              if (changedField?.key === 'method') {
                updateAddresses(value);
              }
              handleSlotModeChange();
            })
          );
        },
      },
    },
  ];
}

/**
 * Creates slot label fields (dynamic based on tiers/instructions).
 * @param { FieldDependencies } deps - Field dependencies object
 * @returns { FormlyFieldConfig[] } Array of Formly field configurations for slot labels
 */
export function createSlotLabelFields(deps: FieldDependencies): FormlyFieldConfig[] {
  const { tenantStore, availableMethodTypes } = deps;

  return [
    {
      ...createCustomLabel('slot', 'counter_3', availableMethodTypes, [
        {
          fn: checkCustomLabelValidation,
          linkedFieldKeys: ['day', 'time'],
        },
        {
          fn: setCustomLabelValue,
          linkedFieldKeys: ['method'],
        },
      ]),
      expressionProperties: {
        hide: (model: unknown) => {
          const method = (model as { method?: string })?.method ?? 'pickup';
          const addressId = (model as { address?: { id: string } })?.address?.id;
          const tiersOrInstructions = tenantStore.getTiersOrInstructions(
            method as 'pickup' | 'delivery',
            addressId
          );
          if (!tiersOrInstructions) return true;
          return tiersOrInstructions.type !== 'slots';
        },
      },
    },
    {
      type: 'custom-label',
      className: 'flex flew-row items-start text-primary-600 mt-4',
      props: {
        label: 'cart.shipping.come-to-store',
        icon: 'counter_3',
        containerClasses: 'p-2',
        iconClasses: 'scale-125',
        checkValidation: true,
        isValid: 'valid',
      },
      expressionProperties: {
        hide: (model: unknown) => {
          const method = (model as { method?: string })?.method ?? 'pickup';
          const addressId = (model as { address?: { id: string } })?.address?.id;
          const tiersOrInstructions = tenantStore.getTiersOrInstructions(
            method as 'pickup' | 'delivery',
            addressId
          );
          if (!tiersOrInstructions) return false;
          return tiersOrInstructions.type === 'slots';
        },
      },
    },
  ];
}

/**
 * Creates day/time slot selection fields.
 * @param { FieldDependencies } deps - Field dependencies object
 * @returns { FormlyFieldConfig } Formly field configuration for slot selection
 */
export function createSlotFields(deps: FieldDependencies): FormlyFieldConfig {
  const { tenantStore, cartStore, translateService } = deps;

  return {
    fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    expressionProperties: {
      hide: (model: unknown) => {
        const method = (model as { method?: string })?.method ?? 'pickup';
        const addressId = (model as { address?: { id: string } })?.address?.id;
        const tiersOrInstructions = tenantStore.getTiersOrInstructions(
          method as 'pickup' | 'delivery',
          addressId
        );
        if (!tiersOrInstructions) return true;
        return tiersOrInstructions.type !== 'slots';
      },
    },
    fieldGroup: [
      {
        key: 'day',
        type: 'select',
        defaultValue: cartStore.day() ?? null,
        props: {
          label: 'cart.shipping.slot.date',
          translate: true,
          required: true,
          options: [],
          addonRight: {
            icon: 'calendar_month',
            type: 'icon',
            classes: 'text-primary-600! fill-primary-600!',
          },
        },
        expressionProperties: {
          'props.disabled': '!model.method || !model.address',
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            const { method, address } = field.model;

            const getTranslatedOptions = (
              method: EcoStoreTenantLogisticsDeliveryType,
              addressId: string | null = null
            ): FormSelectOption[] => {
              const options = tenantStore.getTenantDeliveryOptionSlotsDays(method, addressId);
              return options.map((option: FormSelectOption) => ({
                ...option,
                label: translateService.instant(`cart.shipping.weekdays-labels.${option.label}`),
              }));
            };

            if (field.props && method && address) {
              field.props['options'] = getTranslatedOptions(method, address.id);
            }
            return field.options?.fieldChanges?.pipe(
              filter(
                e =>
                  e.type === 'valueChanges' &&
                  (e.field?.key === 'address' || e.field?.key === 'method')
              ),
              tap(e => {
                const { method, address } = e.field.model;
                if (field.props && method && address?.id) {
                  field.props['options'] = getTranslatedOptions(method, address.id);
                }
                field.formControl?.setValue(null);
                field.formControl?.updateValueAndValidity();
              })
            );
          },
        },
      },
      {
        key: 'time',
        type: 'select',
        defaultValue: cartStore.time() ?? null,
        props: {
          label: 'cart.shipping.slot.time',
          translate: true,
          required: true,
          options: [],
          addonRight: {
            icon: 'access_time',
            type: 'icon',
            classes: 'text-primary-600! fill-primary-600!',
          },
        },
        expressions: {
          'props.disabled': '!model.day',
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            const { method, address, day } = field.model;
            if (field.props && method && address?.id && day) {
              field.props['options'] = tenantStore.getTenantDeliveryOptionSlotsTimes(
                method,
                day,
                address.id
              );
            }
            return field.options?.fieldChanges?.pipe(
              filter(e => e.type === 'valueChanges' && e.field?.key === 'day'),
              tap(() => {
                field.formControl?.setValue(null);
                field.formControl?.updateValueAndValidity();
              }),
              tap(({ value }) => {
                if (field.props) {
                  field.props['options'] = tenantStore.getTenantDeliveryOptionSlotsTimes(
                    field.model.method,
                    value,
                    field.model.address?.id
                  );
                }
              })
            );
          },
        },
      },
    ],
  };
}

/**
 * Creates instructions text field.
 * @param { FieldDependencies } deps - Field dependencies object
 * @returns { FormlyFieldConfig } Formly field configuration for instructions display
 */
export function createInstructionsField(deps: FieldDependencies): FormlyFieldConfig {
  const { tenantStore } = deps;

  return {
    type: 'text',
    expressionProperties: {
      hide: (model: unknown) => {
        const method = (model as { method?: string })?.method ?? 'pickup';
        const addressId = (model as { address?: { id: string } })?.address?.id;
        const tiersOrInstructions = tenantStore.getTiersOrInstructions(
          method as 'pickup' | 'delivery',
          addressId
        );
        if (!tiersOrInstructions) return false;
        return tiersOrInstructions.type === 'slots';
      },
      'props.text': (model: unknown) => {
        const method = (model as { method?: string })?.method ?? 'pickup';
        const addressId = (model as { address?: { id: string } })?.address?.id;
        const tiersOrInstructions = tenantStore.getTiersOrInstructions(
          method as 'pickup' | 'delivery',
          addressId
        );
        return tiersOrInstructions?.instructions || '';
      },
    },
    props: {
      text: '',
      icon: 'info',
    },
  };
}

/**
 * Creates hidden amount field that updates based on method.
 * @param { FieldDependencies } deps - Field dependencies object
 * @returns { FormlyFieldConfig } Formly field configuration for amount calculation
 */
export function createAmountField(deps: FieldDependencies): FormlyFieldConfig {
  const { tenantStore, cartStore } = deps;

  return {
    key: 'amount',
    hooks: {
      onInit: (field: FormlyFieldConfig) => {
        const updateShippingAmount = () => {
          const shippingMethod = field.model?.method;
          const totalAmount = cartStore.totalAmountWithIva() || 0;
          if (shippingMethod) {
            const shippingAmount = tenantStore.getTenantDeliveryOptionCost(
              shippingMethod,
              totalAmount
            );
            field.formControl?.setValue(shippingAmount);
            field.formControl?.updateValueAndValidity();
          }
        };

        updateShippingAmount();

        return field.options?.fieldChanges?.pipe(
          filter(e => e.type === 'valueChanges' && e.field?.key === 'method'),
          tap(() => updateShippingAmount())
        );
      },
    },
  };
}
