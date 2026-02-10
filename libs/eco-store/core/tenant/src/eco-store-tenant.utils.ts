import { UserContact } from '@plastik/core/entities';
import {
  DAYS_MAP,
  EcoStoreTenantAddress,
  EcoStoreTenantLogisticsDeliveryOption,
  EcoStoreTenantLogisticsDeliveryType,
  EcoStoreTenantWindowStatus,
  SlotDays,
} from '@plastik/eco-store/entities';
import { addDays, addWeeks, differenceInMilliseconds, getDay, isBefore, set } from 'date-fns';

/**
 * @description Calculates minutes from the start of the week (Monday 00:00).
 * @param { number } day - The day of the week (0-6, where 0 is Sunday).
 * @param { string } time - The time in HH:MM format.
 * @returns { number } The number of minutes from the start of the week.
 */
export function getMinutesFromStartOfWeek(day: number, time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  // date-fns/JS getDay(): Sunday=0, Monday=1, ...
  // We want Monday=0 to Sunday=6 for linear week comparison
  const adjustedDay = day === 0 ? 6 : day - 1;
  return adjustedDay * 24 * 60 + hours * 60 + minutes;
}

/**
 * @description Gets the next occurrence of a specific day and time.
 * @param { Date } currentDate - The current date.
 * @param { number } targetDay - The target day of the week (0-6, where 0 is Sunday).
 * @param { string } targetTime - The target time in HH:MM format.
 * @returns { Date } The next occurrence of the target day and time.
 */
export function getNextDateFromTime(
  currentDate: Date,
  targetDay: number,
  targetTime: string
): Date {
  const [hours, minutes] = targetTime.split(':').map(Number);
  const currentDay = getDay(currentDate);

  let daysUntil = targetDay - currentDay;
  if (daysUntil < 0) {
    daysUntil += 7;
  }

  let nextDate = addDays(currentDate, daysUntil);
  nextDate = set(nextDate, { hours, minutes, seconds: 0, milliseconds: 0 });

  if (isBefore(nextDate, currentDate)) {
    nextDate = addWeeks(nextDate, 1);
  }

  return nextDate;
}

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
      province: address.province,
      country: address.country,
      phone: address.phone,
      default: address.default,
    }))
    .sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)) as UserContact[];
}

/**
 * @description Determines the store window status based on opening/closing times.
 * @param { Date } now - The current date and time.
 * @param { boolean } orderWindowEnabled - Whether the order window is enabled.
 * @param { SlotDays } openDay - The day the store opens.
 * @param { string } openTime - The time the store opens.
 * @param { SlotDays } closeDay - The day the store closes.
 * @param { string } closeTime - The time the store closes.
 * @param { boolean } active - Whether the store is active.
 * @param { boolean } closed - Whether the store is closed.
 * @returns { EcoStoreTenantWindowStatus } The store window status.
 */
export function calculateStoreWindowStatus(
  now: Date,
  orderWindowEnabled: boolean,
  openDay?: SlotDays,
  openTime?: string,
  closeDay?: SlotDays,
  closeTime?: string,
  active?: boolean,
  closed?: boolean
): EcoStoreTenantWindowStatus {
  if (!active) return 'CANCELLED';
  if (closed) return 'CLOSED_MANUALLY';
  if (!orderWindowEnabled) return 'OPEN';
  if (!openDay || !openTime || !closeDay || !closeTime) return 'CLOSED';

  const currentDay = getDay(now);
  const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const nowVal = getMinutesFromStartOfWeek(currentDay, currentTimeStr);
  const openVal = getMinutesFromStartOfWeek(DAYS_MAP[openDay], openTime);
  const closeVal = getMinutesFromStartOfWeek(DAYS_MAP[closeDay], closeTime);

  let isOpen = false;
  if (openVal < closeVal) {
    isOpen = nowVal >= openVal && nowVal < closeVal;
  } else {
    isOpen = nowVal >= openVal || nowVal < closeVal;
  }

  if (isOpen) {
    const nextClose = getNextDateFromTime(now, DAYS_MAP[closeDay], closeTime);
    const diffMs = differenceInMilliseconds(nextClose, now);
    const oneHourMs = 60 * 60 * 1000;

    if (diffMs > 0 && diffMs <= oneHourMs) {
      return 'CLOSING_SOON';
    }

    return 'OPEN';
  }

  const nextOpen = getNextDateFromTime(now, DAYS_MAP[openDay], openTime);
  const diffMs = differenceInMilliseconds(nextOpen, now);
  const twoHoursMs = 2 * 60 * 60 * 1000;

  if (diffMs > 0 && diffMs <= twoHoursMs) {
    return 'OPENING_SOON';
  }

  return 'CLOSED';
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
