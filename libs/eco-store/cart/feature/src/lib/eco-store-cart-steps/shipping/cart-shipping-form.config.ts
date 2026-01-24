import { inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FormConfig, FormSelectOption } from '@plastik/core/entities';
import { EcoStoreCartState, ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreTenantLogisticsDeliveryType } from '@plastik/eco-store/entities';
import { EcoStoreTenantBaseService } from '@plastik/eco-store/tenant';

import { ShippingMethodOption } from '@plastik/shared/form/shipping-method-selector';
import { filter, tap } from 'rxjs';

/**
 * @description Form configuration for the cart shipping step.
 * @returns {FormConfig<EcoStoreCartState>} FormConfig object.
 */
export function getCartShippingFormConfig(): FormConfig<EcoStoreCartState> {
  const tenantService = inject(EcoStoreTenantBaseService);
  const userProfileStore = inject(pocketBaseUserProfileStore);
  const translateService = inject(TranslateService);
  const cartStore = inject(ecoStoreCartStore);
  const currentLang = translateService.getCurrentLang();
  const logisticsConfig = tenantService.tenant()?.logisticsConfig;

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
      cost:
        option.tiers?.find(tier => cartStore.totalAmountWithIva() >= tier.min)?.min ??
        option.cost ??
        0,
    })) || [];

  const tenantAddresses = [tenantService.getTenantAddress()];
  const userAddresses = userProfileStore.getUserContacts();

  const setCustomLabel = (
    label: string,
    icon: string,
    description: string,
    linkedFieldKeys: string[],
    isValid: 'valid' | 'error' | 'untouched' = 'untouched'
  ) => {
    return {
      type: 'custom-label',
      className: 'flex flew-row items-start text-primary-600 mt-4',
      props: {
        label,
        icon,
        description,
        containerClasses: 'p-2',
        iconClasses: 'scale-125',
        checkValidation: true,
        isValid,
      },
      hooks: {
        onInit: (formly: FormlyFieldConfig) => {
          const checkValidation = (field: FormlyFieldConfig) => {
            const controls = linkedFieldKeys.map(key => field.form?.get(key));
            const isValid = controls.every(control => control?.valid);
            const isTouched = controls.every(control => control?.touched);
            if (formly.props) {
              formly.props['isValid'] = isValid ? 'valid' : isTouched ? 'error' : 'untouched';
            }
          };

          checkValidation(formly);

          return formly.options?.fieldChanges?.pipe(
            filter(
              ({ type, field }) =>
                type === 'valueChanges' && linkedFieldKeys.includes(field?.key as string)
            ),
            tap(({ field }) => checkValidation(field))
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
          ...setCustomLabel(
            'cart.steps.shipping.subtitle',
            'counter_1',
            'cart.steps.shipping.subtitle',
            ['shippingMethod']
          ),
        },
        {
          key: 'shippingMethod',
          type: 'shipping-method-selector',
          defaultValue: 'pickup',
          props: {
            translate: true,
            required: true,
            shippingMethodOptions,
          },
        },
        {
          ...setCustomLabel(
            'cart.shipping.address.title',
            'counter_2',
            'cart.shipping.address.description',
            ['shippingAddress']
          ),
        },
        {
          key: 'shippingAddress',
          type: 'address-selector',
          props: {
            translate: true,
            required: true,
          },
          hooks: {
            onInit: (formly: FormlyFieldConfig) => {
              const method = formly.model?.shippingMethod ?? 'pickup';
              if (formly.props) {
                formly.props['addresses'] = method === 'pickup' ? tenantAddresses : userAddresses;
              }
              return formly.options?.fieldChanges?.pipe(
                filter(e => e.type === 'valueChanges' && e.field?.key === 'shippingMethod'),
                tap(({ value }) => {
                  if (formly.props) {
                    formly.props['addresses'] =
                      value === 'pickup' ? tenantAddresses : userAddresses;
                  }
                  formly.formControl?.setValue(null);
                })
              );
            },
          },
        },
        {
          ...setCustomLabel(
            'cart.shipping.slot.title',
            'counter_3',
            'cart.shipping.slot.description',
            ['shippingDay', 'shippingTime']
          ),
        },
        {
          fieldGroup: [
            {
              fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
              fieldGroup: [
                {
                  key: 'shippingDay',
                  type: 'select',
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
                    'props.disabled': '!model.shippingMethod || !model.shippingAddress',
                  },
                  hooks: {
                    onInit: (formly: FormlyFieldConfig) => {
                      const getTranslatedOptions = (
                        shippingMethod: EcoStoreTenantLogisticsDeliveryType
                      ): FormSelectOption[] => {
                        const options =
                          tenantService.getTenantDeliveryOptionSlotsDays(shippingMethod);
                        return options.map(option => ({
                          ...option,
                          label: translateService.instant(
                            `cart.shipping.weekdays-labels.${option.label}`
                          ),
                        }));
                      };

                      if (formly.props && formly.model?.shippingMethod) {
                        formly.props['options'] = getTranslatedOptions(formly.model.shippingMethod);
                      }
                      return formly.options?.fieldChanges?.pipe(
                        filter(e => e.type === 'valueChanges' && e.field?.key === 'shippingMethod'),
                        tap(({ value }) => {
                          if (formly.props) {
                            formly.props['options'] = getTranslatedOptions(value);
                          }
                          formly.formControl?.setValue(null);
                        })
                      );
                    },
                  },
                },
                {
                  key: 'shippingTime',
                  type: 'select',
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
                    'props.disabled': '!model.shippingDay',
                  },
                  hooks: {
                    onInit: (formly: FormlyFieldConfig) => {
                      if (
                        formly.props &&
                        formly.model?.shippingMethod &&
                        formly.model?.shippingDay
                      ) {
                        formly.props['options'] = tenantService.getTenantDeliveryOptionSlotsTimes(
                          formly.model.shippingMethod,
                          formly.model.shippingDay
                        );
                      }
                      return formly.options?.fieldChanges?.pipe(
                        filter(e => e.type === 'valueChanges' && e.field?.key === 'shippingDay'),
                        tap(({ value }) => {
                          if (formly.props) {
                            formly.props['options'] =
                              tenantService.getTenantDeliveryOptionSlotsTimes(
                                formly.model.shippingMethod,
                                value
                              );
                          }
                          formly.formControl?.setValue(null);
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
          key: 'shippingAmount',
          hooks: {
            onInit: (formly: FormlyFieldConfig) => {
              const updateShippingAmount = () => {
                const shippingMethod = formly.model?.shippingMethod;
                const totalAmount = cartStore.totalAmountWithIva() || 0;
                if (shippingMethod) {
                  const shippingAmount = tenantService.getTenantDeliveryOptionCost(
                    shippingMethod,
                    totalAmount
                  );
                  formly.formControl?.setValue(shippingAmount);
                  formly.formControl?.updateValueAndValidity();
                }
              };

              updateShippingAmount();

              // Subscribe to changes on both fields
              return formly.options?.fieldChanges?.pipe(
                filter(e => e.type === 'valueChanges' && e.field?.key === 'shippingMethod'),
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
    }),
  };
}
