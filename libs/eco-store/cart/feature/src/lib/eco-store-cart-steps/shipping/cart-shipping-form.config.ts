import { inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FormConfig, FormSelectOption } from '@plastik/core/entities';
import { EcoStoreCartState, ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreTenantLogisticsDeliveryType } from '@plastik/eco-store/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

import { AbstractControl } from '@angular/forms';
import { ShippingMethodOption } from '@plastik/shared/form/shipping-method-selector';
import { filter, tap } from 'rxjs';

/**
 * @description Form configuration for the cart shipping step.
 * @returns {FormConfig<EcoStoreCartState>} FormConfig object.
 */
export function getCartShippingFormConfig(): FormConfig<EcoStoreCartState> {
  const tenantStore = inject(ecoStoreTenantStore);
  const userProfileStore = inject(pocketBaseUserProfileStore);
  const translateService = inject(TranslateService);
  const cartStore = inject(ecoStoreCartStore);
  const currentLang = translateService.getCurrentLang();
  const logisticsConfig = tenantStore.tenant()?.logisticsConfig;

  const shippingMethodOptions: ShippingMethodOption[] =
    logisticsConfig?.options.map(option => ({
      type: option.type,
      icon: option.type === 'pickup' ? 'store' : 'local_shipping',
      title: `cart.steps.shipping.method.${option.type}.title`,
      subtitle: option.instructions
        ? typeof option.instructions === 'string'
          ? option.instructions
          : option.instructions[currentLang]
        : undefined,
      theme: option.type === 'pickup' ? 'primary' : 'secondary',
      cost: option.tiers?.find(tier => tier.cost === 0)?.min ?? option.cost ?? 0,
    })) || [];

  const tenantAddresses = tenantStore.getTenantAddressesContacts();
  const userAddresses = userProfileStore.getUserContacts();

  const checkCustomLabelValidation = (field: FormlyFieldConfig, linkedFieldKeys: string[] = []) => {
    const controls = linkedFieldKeys.map((key: string) =>
      field.form?.get(key)
    ) as AbstractControl[];
    const isValid = controls.every(control => control?.valid);
    const isTouched = controls.every(control => control?.touched);
    if (field?.props) {
      field.props['isValid'] = isValid ? 'valid' : isTouched ? 'error' : 'untouched';
    }
  };

  const setCustomLabelValue = (field: FormlyFieldConfig): void => {
    const method = field.model?.method ?? 'pickup';
    if (field.props) {
      field.props['label'] =
        method === 'pickup'
          ? `cart.shipping.${field.props['key']}.pickup.title`
          : `cart.shipping.${field.props['key']}.delivery.title`;
    }
  };

  type HookFunction = {
    fn: (field: FormlyFieldConfig, linkedFieldKeys: string[]) => void;
    linkedFieldKeys: string[];
  };

  const setCustomLabel = (
    key: string,
    label: string,
    icon: string,
    hooks: HookFunction[] = [],
    isValid: 'valid' | 'error' | 'untouched' = 'untouched'
  ) => {
    // Collect all unique linkedFieldKeys from all hooks
    const allLinkedFieldKeys = Array.from(new Set(hooks.flatMap(h => h.linkedFieldKeys)));

    return {
      type: 'custom-label',
      className: 'flex flew-row items-start text-primary-600 mt-4',
      props: {
        key,
        label,
        icon,
        containerClasses: 'p-2',
        iconClasses: 'scale-125',
        checkValidation: true,
        isValid,
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          hooks.forEach(({ fn, linkedFieldKeys }) => fn(field, linkedFieldKeys));

          return field.options?.fieldChanges?.pipe(
            filter(
              e => e.type === 'valueChanges' && allLinkedFieldKeys.includes(e.field?.key as string)
            ),
            tap(() => hooks.forEach(({ fn, linkedFieldKeys }) => fn(field, linkedFieldKeys)))
          );
        },
      },
    };
  };

  const config = [
    {
      fieldGroupClassName: 'flex flex-col gap-6',
      fieldGroup: [
        {
          ...setCustomLabel('method', 'cart.shipping.method.title', 'counter_1', [
            {
              fn: checkCustomLabelValidation,
              linkedFieldKeys: ['method'],
            },
          ]),
        },
        {
          key: 'method',
          type: 'shipping-method-selector',
          defaultValue: cartStore.method() ?? 'pickup',
          props: {
            translate: true,
            required: true,
            shippingMethodOptions,
          },
        },
        {
          ...setCustomLabel('address', '', 'counter_2', [
            {
              fn: checkCustomLabelValidation,
              linkedFieldKeys: ['address'],
            },
            {
              fn: setCustomLabelValue,
              linkedFieldKeys: ['method'],
            },
          ]),
        },
        {
          key: 'address',
          type: 'address-selector',
          defaultValue: cartStore.address() ?? null,
          props: {
            translate: true,
            required: true,
          },
          hooks: {
            onInit: (field: FormlyFieldConfig) => {
              const getAddressesForMethod = (method: 'pickup' | 'delivery') =>
                method === 'pickup' ? tenantAddresses : userAddresses;

              const setDefaultAddress = (
                method: 'pickup' | 'delivery',
                shouldPreserveValue = true
              ) => {
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

              // Initialize with current method
              const currentMethod = field.model?.method ?? 'pickup';
              if (field.props) {
                field.props['addresses'] = getAddressesForMethod(currentMethod);
              }
              setDefaultAddress(currentMethod);

              return field.options?.fieldChanges?.pipe(
                filter(e => e.type === 'valueChanges' && e.field?.key === 'method'),
                tap(({ value }) => updateAddresses(value))
              );
            },
          },
        },
        {
          ...setCustomLabel('slot', 'cart.shipping.slot.title', 'counter_3', [
            {
              fn: checkCustomLabelValidation,
              linkedFieldKeys: ['day', 'time'],
            },
            {
              fn: setCustomLabelValue,
              linkedFieldKeys: ['method'],
            },
          ]),
        },
        {
          fieldGroup: [
            {
              fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
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
                        const options = tenantStore.getTenantDeliveryOptionSlotsDays(
                          method,
                          addressId
                        );
                        return options.map(option => ({
                          ...option,
                          label: translateService.instant(
                            `cart.shipping.weekdays-labels.${option.label}`
                          ),
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
            },
          ],
        },
        {
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

              // Subscribe to changes on both fields
              return field.options?.fieldChanges?.pipe(
                filter(e => e.type === 'valueChanges' && e.field?.key === 'method'),
                tap(() => updateShippingAmount())
              );
            },
          },
        },
      ],
    },
  ];

  return {
    getConfig: () => config as FormlyFieldConfig[],
    getSubmitFormConfig: () => ({
      visible: false,
      submitAvailable: false,
      emitOnChange: true,
      buttonStyle: 'hidden!',
    }),
  };
}
