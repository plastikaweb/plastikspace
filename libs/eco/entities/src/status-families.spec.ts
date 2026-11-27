import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { ORDER_CYCLE_STATUSES } from './order-cycle';
import {
  MEMBER_ALLOWLIST_STATUS_CHIPS,
  MEMBERSHIP_STATUS_CHIPS,
  MEMBERSHIP_STATUSES,
  ORDER_CYCLE_STATUS_CHIPS,
  PAYMENT_STATUS_CHIPS,
  PAYMENT_STATUSES,
  TENANT_REQUEST_STATUS_CHIPS,
} from './status-families';

interface SchemaField {
  name: string;
  type: string;
  values?: string[];
}

const SCHEMA = 'apps/eco-store/pocketbase/pb_schema.json';

/**
 * Walks up from the test's working directory to the checkout that holds the schema.
 * @returns {string} The schema's absolute path.
 */
function schemaPath(): string {
  let dir = process.cwd();

  while (!existsSync(join(dir, SCHEMA)) && dirname(dir) !== dir) dir = dirname(dir);

  return join(dir, SCHEMA);
}

const schema = JSON.parse(readFileSync(schemaPath(), 'utf8')) as {
  name: string;
  fields: SchemaField[];
}[];

const selectValues = (collection: string, field: string): string[] =>
  schema.find(entry => entry.name === collection)?.fields.find(entry => entry.name === field)
    ?.values ?? [];

describe('status families', () => {
  it('list every value of the PocketBase select fields they mirror', () => {
    expect([...ORDER_CYCLE_STATUSES].sort()).toEqual(selectValues('order_cycles', 'status').sort());
    expect([...PAYMENT_STATUSES].sort()).toEqual(selectValues('orders', 'paymentStatus').sort());
    expect([...MEMBERSHIP_STATUSES].sort()).toEqual(
      selectValues('users', 'membershipStatus').sort()
    );
  });

  it('draw each state with the icon and colour of the frozen DS §06', () => {
    const drawn = (chips: { options: { value: string; icon: string; type: string }[] }) =>
      chips.options.map(({ value, icon, type }) => `${value}:${icon}:${type}`);

    expect(drawn(ORDER_CYCLE_STATUS_CHIPS)).toEqual([
      'DRAFT:draft:neutral',
      'OPEN:storefront:success',
      'PROCESSING:autorenew:info',
      'COMPLETED:task_alt:primary',
      'CLOSED:lock:neutral',
    ]);
    expect(drawn(PAYMENT_STATUS_CHIPS)).toEqual([
      'UNPAID:euro:warning',
      'PAID:euro:success',
      'REFUNDED:euro:info',
      'FAILED:euro:error',
    ]);
    expect(drawn(MEMBERSHIP_STATUS_CHIPS)).toEqual([
      'TRIAL:hourglass_top:info',
      'ACTIVE:verified:success',
      'INACTIVE:pause:neutral',
      'SUSPENDED:block:error',
    ]);
    expect(drawn(TENANT_REQUEST_STATUS_CHIPS)).toEqual([
      'PENDING:schedule:warning',
      'PROCESSED:done:success',
      'DISMISSED:cancel:neutral',
    ]);
    expect(drawn(MEMBER_ALLOWLIST_STATUS_CHIPS)).toEqual([
      'PENDING:mail:info',
      'CONSUMED:how_to_reg:success',
      'REVOKED:link_off:error',
    ]);
  });

  it('give every state a translation key under its family, and the same answer in every map', () => {
    expect(MEMBERSHIP_STATUS_CHIPS.labels.TRIAL).toBe('members.status.trial');
    expect(TENANT_REQUEST_STATUS_CHIPS.labels.DISMISSED).toBe('requests.status.dismissed');

    for (const chips of [
      ORDER_CYCLE_STATUS_CHIPS,
      PAYMENT_STATUS_CHIPS,
      MEMBERSHIP_STATUS_CHIPS,
      TENANT_REQUEST_STATUS_CHIPS,
      MEMBER_ALLOWLIST_STATUS_CHIPS,
    ]) {
      const maps = chips as unknown as {
        labels: Record<string, string>;
        icons: Record<string, string>;
        types: Record<string, string>;
        options: { value: string; label: string; icon: string; type: string }[];
      };

      for (const option of maps.options) {
        expect(maps.labels[option.value]).toBe(option.label);
        expect(maps.icons[option.value]).toBe(option.icon);
        expect(maps.types[option.value]).toBe(option.type);
      }
    }
  });
});
