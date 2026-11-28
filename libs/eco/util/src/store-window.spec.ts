import { EcoStoreTenant, EcoStoreTenantLogistics } from '@plastik/eco/entities';
import {
  getMinutesFromStartOfWeek,
  getNextDateFromTime,
  getTenantNextOpenDate,
  getTenantWindowStatus,
} from './store-window';

type OrderWindow = EcoStoreTenantLogistics['orderWindow'];

// Local time, so the specs hold in any time zone. 2026-11-23 is a Monday.
const at = (day: number, hours: number, minutes = 0) => new Date(2026, 10, day, hours, minutes);

const FRIDAY_TO_SUNDAY: OrderWindow = {
  enabled: true,
  openDay: 'friday',
  openTime: '08:00',
  closeDay: 'sunday',
  closeTime: '22:00',
};

const SATURDAY_TO_MONDAY: OrderWindow = {
  enabled: true,
  openDay: 'saturday',
  openTime: '20:00',
  closeDay: 'monday',
  closeTime: '10:00',
};

const tenantWith = (
  orderWindow: OrderWindow,
  flags: Partial<Pick<EcoStoreTenant, 'active' | 'closed'>> = {}
) =>
  ({
    active: true,
    closed: false,
    ...flags,
    logisticsConfig: { orderWindow, options: [] },
  }) as unknown as EcoStoreTenant;

describe('store-window', () => {
  describe('getMinutesFromStartOfWeek', () => {
    it('counts from Monday 00:00 and puts Sunday last', () => {
      expect(getMinutesFromStartOfWeek(1, '00:00')).toBe(0);
      expect(getMinutesFromStartOfWeek(2, '01:30')).toBe(24 * 60 + 90);
      expect(getMinutesFromStartOfWeek(0, '23:59')).toBe(6 * 24 * 60 + 23 * 60 + 59);
    });
  });

  describe('getNextDateFromTime', () => {
    it('finds the weekday later this week', () => {
      expect(getNextDateFromTime(at(30, 9), 5, '08:00')).toEqual(new Date(2026, 11, 4, 8, 0));
    });

    it('keeps today when the time is still ahead', () => {
      expect(getNextDateFromTime(at(30, 7), 1, '08:00')).toEqual(at(30, 8));
    });

    it('moves to next week when today’s time has passed', () => {
      expect(getNextDateFromTime(at(30, 9), 1, '08:00')).toEqual(new Date(2026, 11, 7, 8, 0));
    });

    it('reaches Sunday from Saturday', () => {
      expect(getNextDateFromTime(at(28, 12), 0, '22:00')).toEqual(at(29, 22));
    });
  });

  describe('getTenantWindowStatus', () => {
    it('reads CANCELLED without a tenant or when the platform deactivated it', () => {
      expect(getTenantWindowStatus(null, at(28, 12))).toBe('CANCELLED');
      expect(
        getTenantWindowStatus(tenantWith(FRIDAY_TO_SUNDAY, { active: false }), at(28, 12))
      ).toBe('CANCELLED');
    });

    it('reads CLOSED_MANUALLY when the tenant closed it, even inside the window', () => {
      expect(
        getTenantWindowStatus(tenantWith(FRIDAY_TO_SUNDAY, { closed: true }), at(28, 12))
      ).toBe('CLOSED_MANUALLY');
    });

    it('reads OPEN for continuous selling', () => {
      expect(getTenantWindowStatus(tenantWith({ enabled: false }), at(25, 3))).toBe('OPEN');
    });

    it('reads CLOSED when the window misses a day or a time', () => {
      expect(
        getTenantWindowStatus(tenantWith({ ...FRIDAY_TO_SUNDAY, closeTime: undefined }), at(28, 12))
      ).toBe('CLOSED');
    });

    it.each([
      ['Saturday noon, inside the window', at(28, 12), 'OPEN'],
      ['Sunday 21:30, its last hour', at(29, 21, 30), 'CLOSING_SOON'],
      ['Sunday 22:00, the closing minute', at(29, 22), 'CLOSED'],
      ['Friday 07:00, an hour before it opens', at(27, 7), 'OPENING_SOON'],
      ['Friday 05:30, two and a half hours before', at(27, 5, 30), 'CLOSED'],
      ['Wednesday, mid-week', at(25, 12), 'CLOSED'],
    ])('Friday to Sunday window: %s → %s', (_label, now, status) => {
      expect(getTenantWindowStatus(tenantWith(FRIDAY_TO_SUNDAY), now)).toBe(status);
    });

    it.each([
      ['Sunday noon, inside the window', at(29, 12), 'OPEN'],
      ['Monday 09:30, its last hour', at(30, 9, 30), 'CLOSING_SOON'],
      ['Wednesday, mid-week', at(25, 12), 'CLOSED'],
    ])('window across the weekend boundary: %s → %s', (_label, now, status) => {
      expect(getTenantWindowStatus(tenantWith(SATURDAY_TO_MONDAY), now)).toBe(status);
    });
  });

  describe('getTenantNextOpenDate', () => {
    it('has no date for continuous selling', () => {
      expect(getTenantNextOpenDate(tenantWith({ enabled: false }), at(25, 12), 'OPEN')).toBeNull();
    });

    it('counts to the close in the last hour', () => {
      expect(
        getTenantNextOpenDate(tenantWith(FRIDAY_TO_SUNDAY), at(29, 21, 30), 'CLOSING_SOON')
      ).toEqual(at(29, 22));
    });

    it('counts to the next opening otherwise', () => {
      expect(getTenantNextOpenDate(tenantWith(FRIDAY_TO_SUNDAY), at(25, 12), 'CLOSED')).toEqual(
        at(27, 8)
      );
    });

    it('has no date when the window misses its opening time', () => {
      expect(
        getTenantNextOpenDate(
          tenantWith({ ...FRIDAY_TO_SUNDAY, openTime: undefined }),
          at(25, 12),
          'CLOSED'
        )
      ).toBeNull();
    });
  });
});
