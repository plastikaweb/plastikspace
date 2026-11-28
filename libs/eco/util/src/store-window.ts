import {
  DAYS_MAP,
  EcoStoreTenant,
  EcoStoreTenantWindowStatus,
  SlotDays,
} from '@plastik/eco/entities';
import { addDays, addWeeks, differenceInMilliseconds, getDay, isBefore, set } from 'date-fns';

const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * Minutes from the start of the week, Monday 00:00.
 * @param {number} day The day of the week as `getDay()` counts it: Sunday 0, Monday 1.
 * @param {string} time The time, `HH:MM`.
 * @returns {number} The minutes since Monday 00:00.
 */
export function getMinutesFromStartOfWeek(day: number, time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  // getDay() counts from Sunday = 0; the week compared here starts on Monday = 0.
  const adjustedDay = day === 0 ? 6 : day - 1;

  return adjustedDay * 24 * 60 + hours * 60 + minutes;
}

/**
 * The next occurrence of a weekday and time, at or after `currentDate`.
 * @param {Date} currentDate The moment to count from.
 * @param {number} targetDay The weekday as `getDay()` counts it: Sunday 0, Monday 1.
 * @param {string} targetTime The time, `HH:MM`.
 * @returns {Date} That weekday and time this week, or next week once it has passed.
 */
export function getNextDateFromTime(
  currentDate: Date,
  targetDay: number,
  targetTime: string
): Date {
  const [hours, minutes] = targetTime.split(':').map(Number);
  let daysUntil = targetDay - getDay(currentDate);

  if (daysUntil < 0) {
    daysUntil += 7;
  }

  let nextDate = set(addDays(currentDate, daysUntil), {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  });

  if (isBefore(nextDate, currentDate)) {
    nextDate = addWeeks(nextDate, 1);
  }

  return nextDate;
}

/**
 * The state of a store's order window at a given moment.
 * A store the platform deactivated reads `CANCELLED`, one its tenant closed `CLOSED_MANUALLY`,
 * and one without a weekly window (continuous selling) `OPEN`. Inside the window it is `OPEN`,
 * or `CLOSING_SOON` in its last hour; outside it is `CLOSED`, or `OPENING_SOON` in the two hours
 * before it opens. A window with a missing day or time reads `CLOSED`.
 * @param {Date} now The moment to evaluate.
 * @param {boolean} orderWindowEnabled Whether the tenant sells in a weekly window.
 * @param {SlotDays} [openDay] The day the window opens.
 * @param {string} [openTime] The time it opens, `HH:MM`.
 * @param {SlotDays} [closeDay] The day the window closes.
 * @param {string} [closeTime] The time it closes, `HH:MM`.
 * @param {boolean} [active] Whether the platform keeps the store active.
 * @param {boolean} [closed] Whether the tenant closed the store by hand.
 * @returns {EcoStoreTenantWindowStatus} The window state.
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

  const nowVal = getMinutesFromStartOfWeek(
    getDay(now),
    `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  );
  const openVal = getMinutesFromStartOfWeek(DAYS_MAP[openDay], openTime);
  const closeVal = getMinutesFromStartOfWeek(DAYS_MAP[closeDay], closeTime);
  const isOpen =
    openVal < closeVal
      ? nowVal >= openVal && nowVal < closeVal
      : nowVal >= openVal || nowVal < closeVal;

  if (isOpen) {
    const untilClose = differenceInMilliseconds(
      getNextDateFromTime(now, DAYS_MAP[closeDay], closeTime),
      now
    );

    return untilClose > 0 && untilClose <= ONE_HOUR_MS ? 'CLOSING_SOON' : 'OPEN';
  }

  const untilOpen = differenceInMilliseconds(
    getNextDateFromTime(now, DAYS_MAP[openDay], openTime),
    now
  );

  return untilOpen > 0 && untilOpen <= 2 * ONE_HOUR_MS ? 'OPENING_SOON' : 'CLOSED';
}

/**
 * The state of a tenant's order window at a given moment, read from the tenant record.
 * @param {EcoStoreTenant | null} tenant The tenant; without one the store reads `CANCELLED`.
 * @param {Date} now The moment to evaluate.
 * @returns {EcoStoreTenantWindowStatus} The window state, as `calculateStoreWindowStatus` rules it.
 */
export function getTenantWindowStatus(
  tenant: EcoStoreTenant | null | undefined,
  now: Date
): EcoStoreTenantWindowStatus {
  const orderWindow = tenant?.logisticsConfig?.orderWindow;

  return calculateStoreWindowStatus(
    now,
    !!orderWindow?.enabled,
    orderWindow?.openDay,
    orderWindow?.openTime,
    orderWindow?.closeDay,
    orderWindow?.closeTime,
    tenant?.active,
    tenant?.closed
  );
}

/**
 * The date a store's countdown counts to.
 * In its last hour (`CLOSING_SOON`) that is the next close; in every other state it is the next
 * opening of the weekly window. A tenant without a weekly window has none.
 * @param {EcoStoreTenant | null} tenant The tenant.
 * @param {Date} now The moment to count from.
 * @param {EcoStoreTenantWindowStatus} status The window state at `now`.
 * @returns {Date | null} The date, or `null` without a window or without its day and time.
 */
export function getTenantNextOpenDate(
  tenant: EcoStoreTenant | null | undefined,
  now: Date,
  status: EcoStoreTenantWindowStatus
): Date | null {
  const orderWindow = tenant?.logisticsConfig?.orderWindow;

  if (!orderWindow?.enabled) {
    return null;
  }

  const { openDay, openTime, closeDay, closeTime } = orderWindow;

  if (status === 'CLOSING_SOON') {
    return closeDay && closeTime ? getNextDateFromTime(now, DAYS_MAP[closeDay], closeTime) : null;
  }

  return openDay && openTime ? getNextDateFromTime(now, DAYS_MAP[openDay], openTime) : null;
}
