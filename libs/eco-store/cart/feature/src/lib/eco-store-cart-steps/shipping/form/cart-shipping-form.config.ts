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

import {
  EcoStoreTenantLogistics,
  EcoStoreTenantLogisticsDeliveryTier,
  EcoStoreTenantLogisticsDeliveryType,
} from '@plastik/eco-store/entities';

/**
 * Builds shipping method options from logistics configuration.
 * @param { EcoStoreTenantLogistics | undefined } logisticsConfig - Tenant logistics configuration object
 * @returns { ShippingMethodOption[] } Array of shipping method options with icons, titles, and costs
 */
function buildShippingMethodOptions(
  logisticsConfig: EcoStoreTenantLogistics | undefined
): ShippingMethodOption[] {
  const availableOptions =
    logisticsConfig?.options?.filter((option: { enabled: boolean }) => option.enabled) || [];

  return availableOptions.map(
    (option: {
      type: EcoStoreTenantLogisticsDeliveryType;
      tiers?: EcoStoreTenantLogisticsDeliveryTier[];
      cost?: number;
    }) => ({
      type: option.type,
      icon: option.type === 'pickup' ? 'store' : 'local_shipping',
      title: `cart.steps.shipping.method.${option.type}.title`,
      theme: option.type === 'pickup' ? 'primary' : 'secondary',
      cost:
        option.tiers?.find((tier: { cost: number }) => tier.cost === 0)?.min ?? option.cost ?? 0,
    })
  );
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

  const logisticsConfig = tenantStore.tenant()?.logisticsConfig;
  const availableShippingMethodOptions = buildShippingMethodOptions(logisticsConfig);
  const availableMethodTypes = logisticsConfig?.options
    ?.filter(option => option.enabled)
    .map(option => option.type);

  const dependencies: FieldDependencies = {
    tenantStore,
    cartStore,
    translateService,
    tenantAddresses: tenantStore.getTenantAddressesContacts(),
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
