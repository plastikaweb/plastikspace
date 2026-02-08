import { inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { FormConfig } from '@plastik/core/entities';
import { EcoStoreCartState, ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { ShippingMethodOption } from '@plastik/shared/form/shipping-method-selector';
import {
  createAddressField,
  createAmountField,
  createInstructionsField,
  createMethodField,
  createSlotFields,
  createSlotLabelFields,
  FieldDependencies,
} from './cart-shipping-form-fields';

/**
 * Builds shipping method options from tenant store, filtering only fully configured methods.
 * @param { InstanceType<typeof ecoStoreTenantStore> } tenantStore - Tenant store instance
 * @returns { ShippingMethodOption[] } Array of shipping method options with icons, titles, and costs
 */
function buildShippingMethodOptions(
  tenantStore: InstanceType<typeof ecoStoreTenantStore>
): ShippingMethodOption[] {
  const availableMethodTypes = tenantStore.getTenantAvailableShippingMethods();
  const logisticsConfig = tenantStore.tenant()?.logisticsConfig;

  if (!logisticsConfig?.options || availableMethodTypes.length === 0) return [];

  return availableMethodTypes
    .map(methodType => {
      const option = logisticsConfig.options.find(opt => opt.type === methodType);
      if (!option) return null;

      return {
        type: option.type,
        icon: option.type === 'pickup' ? 'store' : 'local_shipping',
        title: `cart.steps.shipping.method.${option.type}.title`,
        theme: option.type === 'pickup' ? 'primary' : 'secondary',
        cost:
          option.tiers?.find((tier: { cost: number }) => tier.cost === 0)?.min ?? option.cost ?? 0,
      };
    })
    .filter(opt => opt !== null) as ShippingMethodOption[];
}

/**
 * Form configuration for the cart shipping step.
 * Handles shipping method selection, address selection, and slot/instructions display.
 * @returns { FormConfig<EcoStoreCartState> }   Form configuration object with config and submit configuration
 */
export function getCartShippingFormConfig(): FormConfig<EcoStoreCartState> {
  const tenantStore = inject(ecoStoreTenantStore);
  const userProfileStore = inject(pocketBaseUserProfileStore);
  const cartStore = inject(ecoStoreCartStore);
  const translateService = inject(TranslateService);

  const availableShippingMethodOptions = buildShippingMethodOptions(tenantStore);
  const availableMethodTypes = tenantStore.getTenantAvailableShippingMethods();

  const dependencies: FieldDependencies = {
    tenantStore,
    cartStore,
    translateService,
    tenantAddresses: tenantStore.tenantAddressesContacts(),
    userAddresses: userProfileStore.getUserContacts(),
    availableMethodTypes,
  };

  const config: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-col gap-6',
      fieldGroup: [
        ...createMethodField(
          availableShippingMethodOptions,
          availableMethodTypes,
          cartStore.method() ?? 'pickup'
        ),
        ...createAddressField(dependencies, cartStore.address() ?? null),
        ...createSlotLabelFields(dependencies),
        createSlotFields(dependencies),
        createInstructionsField(dependencies),
        createAmountField(dependencies),
      ],
    },
  ];

  return {
    getConfig: () => config,
    getSubmitFormConfig: () => ({
      visible: false,
      submitAvailable: false,
      emitOnChange: true,
      buttonStyle: 'hidden!',
    }),
  };
}
