import { UserContact } from '@plastik/core/entities';
import { describe, expect, it } from 'vitest';
import { pickDefaultShippingAddress } from './cart-shipping-form-fields';

/**
 * Builds a minimal address fixture.
 * @param { Partial<UserContact> } overrides - Fields to override on the fixture.
 * @returns { UserContact } The resulting address.
 */
function address(overrides: Partial<UserContact>): UserContact {
  return {
    id: 'id',
    name: 'name',
    address: 'address',
    city: 'city',
    zip: '00000',
    phone: '000000000',
    ...overrides,
  } as UserContact;
}

describe('pickDefaultShippingAddress', () => {
  it('prefers the address flagged as default', () => {
    const first = address({ id: 'first' });
    const flagged = address({ id: 'flagged', default: true });

    expect(pickDefaultShippingAddress([first, flagged])).toEqual(flagged);
  });

  it('falls back to the first address when none is flagged as default', () => {
    const first = address({ id: 'first' });
    const second = address({ id: 'second' });

    expect(pickDefaultShippingAddress([first, second])).toEqual(first);
  });

  it('returns null for an empty address list', () => {
    expect(pickDefaultShippingAddress([])).toBeNull();
  });
});
