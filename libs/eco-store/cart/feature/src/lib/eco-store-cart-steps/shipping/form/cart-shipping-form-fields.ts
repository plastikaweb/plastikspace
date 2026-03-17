import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FormSelectOption } from '@plastik/core/entities';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreTenantLogisticsDeliveryType, SlotDays } from '@plastik/eco-store/entities';
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
  userProfileStore: InstanceType<typeof pocketBaseUserProfileStore>;
  availableMethodTypes: string[] | undefined;
}

/**
 * Creates shipping method selector field.
 * @param { ShippingMethodOption[] } availableShippingMethodOptions - Array of available shipping method options
 * @param { string[] | undefined } availableMethodTypes - Array of available method type strings
 * @returns { FormlyFieldConfig[] } Array of Formly field configurations for method selection
 */
export function createMethodField(
  availableShippingMethodOptions: ShippingMethodOption[],
  availableMethodTypes: string[] | undefined
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
 * @returns { FormlyFieldConfig[] } Array of Formly field configurations for address selection
 */
export function createAddressField(deps: FieldDependencies): FormlyFieldConfig[] {
  const { tenantStore, userProfileStore, availableMethodTypes } = deps;

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
      props: {
        translate: true,
        required: true,
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          const tenantAddresses = tenantStore.tenantAddressesContacts();
          const userAddresses = userProfileStore.getUserContacts();
          const getAddressesForMethod = (method: EcoStoreTenantLogisticsDeliveryType) => {
            const addresses = method === 'pickup' ? tenantAddresses : userAddresses;
            if (field.props) {
              field.props['addresses'] = addresses;
            }
          };

          getAddressesForMethod(field.model.method);

          return field.options?.fieldChanges?.pipe(
            filter(e => e.type === 'valueChanges' && e.field?.key === 'method'),
            tap(() => {
              const method = field.model.method as EcoStoreTenantLogisticsDeliveryType;
              const newAddresses = method === 'pickup' ? tenantAddresses : userAddresses;
              getAddressesForMethod(method);

              const defaultAddress = newAddresses.find(a => a.default) || newAddresses[0] || null;

              if (defaultAddress) {
                field.model.address = defaultAddress;
                field.model.day = null;
                field.model.time = null;
              } else {
                field.model.address = null;
              }
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
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          const config = tenantStore.getTiersOrInstructions(
            field.model.method ?? 'pickup',
            field.model.address?.id
          );
          return config?.type !== 'slots';
        },
      },
    },
    {
      type: 'custom-label',
      className: 'flex flew-row items-start text-primary-600 mt-4',
      props: {
        label: 'cart.shipping.comeToStore',
        icon: 'counter_3',
        containerClasses: 'p-2',
        iconClasses: 'scale-125',
        checkValidation: true,
        isValid: 'valid',
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          const tiersOrInstructions = tenantStore.getTiersOrInstructions(
            field.model.method ?? 'pickup',
            field.model.address?.id
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
export function createSlotFields(deps: FieldDependencies): FormlyFieldConfig[] {
  const { tenantStore, cartStore, translateService } = deps;

  return [
    {
      fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          const config = deps.tenantStore.getTiersOrInstructions(
            field.model.method ?? 'pickup',
            field.model.address?.id
          );
          return config?.type !== 'slots';
        },
      },
      fieldGroup: [
        {
          key: 'day',
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
          expressions: {
            'props.disabled': (field: FormlyFieldConfig) =>
              !field.model?.method || !field.model?.address,
          },
          hooks: {
            onInit: (field: FormlyFieldConfig) => {
              const getTranslatedOptions = (
                method: EcoStoreTenantLogisticsDeliveryType,
                addressId: string | null = null
              ): FormSelectOption[] => {
                const options = tenantStore.getTenantDeliveryOptionSlotsDays(method, addressId);
                return options.map((option: FormSelectOption) => ({
                  ...option,
                  label: translateService.instant(`common.weekdays.${option.label}`),
                }));
              };

              const updateOptions = (model: unknown) => {
                const { method, address } = model as { method?: string; address?: { id: string } };
                if (field.props && method && address) {
                  field.props['options'] = getTranslatedOptions(
                    method as EcoStoreTenantLogisticsDeliveryType,
                    address.id
                  );
                }
              };

              updateOptions(field.model);

              return field.options?.fieldChanges?.pipe(
                filter(e => e.type === 'valueChanges' && e.field?.key === 'address'),
                tap(() => updateOptions(field.model))
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
            'props.disabled': (field: FormlyFieldConfig) => !field.model?.day,
          },
          hooks: {
            onInit: (field: FormlyFieldConfig) => {
              const updateOptions = (model: unknown) => {
                const { method, address, day } = model as {
                  method?: string;
                  address?: { id: string };
                  day?: SlotDays;
                };
                if (field.props && method && address && day) {
                  field.props['options'] = tenantStore.getTenantDeliveryOptionSlotsTimes(
                    method as EcoStoreTenantLogisticsDeliveryType,
                    day,
                    address.id
                  );
                }
              };

              updateOptions(field.model);

              return field.options?.fieldChanges?.pipe(
                filter(e => e.type === 'valueChanges' && e.field?.key === 'day'),
                tap(({ value }) => updateOptions({ ...field.model, day: value }))
              );
            },
          },
        },
      ],
    },
  ];
}

/**
 * Creates instructions text field.
 * @param { FieldDependencies } deps - Field dependencies object
 * @returns { FormlyFieldConfig } Formly field configuration for instructions display
 */
export function createInstructionsField(deps: FieldDependencies): FormlyFieldConfig[] {
  const { tenantStore } = deps;

  return [
    {
      type: 'text',
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          const config = tenantStore.getTiersOrInstructions(
            field.model.method ?? 'pickup',
            field.model.address?.id
          );
          return config?.type !== 'instructions';
        },
        'props.text': (field: FormlyFieldConfig) => {
          const method = field.model.method ?? 'pickup';
          const addressId = field.model.address?.id;
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
    },
  ];
}
