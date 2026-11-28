import { UserContact } from '@plastik/core/entities';
import {
  EcoStoreTenantAddress,
  EcoStoreTenantLogisticsDeliveryOption,
  EcoStoreTenantLogisticsDeliveryType,
} from '@plastik/eco-store/entities';

/**
 * @description Formats tenant addresses into a standardized UserContact list.
 * @param { EcoStoreTenantAddress[] } addresses - The tenant addresses to format.
 * @returns { UserContact[] } The formatted tenant addresses.
 */
export function formatTenantAddresses(addresses: EcoStoreTenantAddress[]): UserContact[] {
  return addresses
    .map(address => ({
      id: address.id,
      name: address.name,
      address: address.address,
      zip: address.zip,
      city: address.city,
      phone: address.phone,
      default: address.default,
    }))
    .sort(
      (firstAddress, secondAddress) =>
        (secondAddress.default ? 1 : 0) - (firstAddress.default ? 1 : 0)
    ) as UserContact[];
}

/**
 * @description Checks if a specific shipping method is fully configured and not manually closed.
 * @param { EcoStoreTenantLogisticsDeliveryType } type - The type of shipping method.
 * @param { EcoStoreTenantLogisticsDeliveryOption[] } options - The shipping method options.
 * @param { EcoStoreTenantAddress[] } addresses - The tenant addresses.
 * @returns { boolean } True if the shipping method is fully configured and not manually closed, false otherwise.
 */
export function isShippingMethodConfigured(
  type: EcoStoreTenantLogisticsDeliveryType,
  options: EcoStoreTenantLogisticsDeliveryOption[],
  addresses: EcoStoreTenantAddress[]
): boolean {
  const option = options.find(opt => opt.type === type);

  if (!option?.enabled) return false;

  if (type === 'pickup') {
    const hasGlobalPickupConfig =
      (option.slots && Object.keys(option.slots).length > 0) || !!option.instructions;

    const hasAddressConfig = addresses.some(
      address => (address.slots && Object.keys(address.slots).length > 0) || !!address.instructions
    );

    return hasGlobalPickupConfig || hasAddressConfig;
  }

  if (type === 'delivery') {
    return !!(option.slots && Object.keys(option.slots).length > 0);
  }

  return false;
}
