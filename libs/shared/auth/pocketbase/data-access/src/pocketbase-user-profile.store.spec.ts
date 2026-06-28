import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { PocketBaseUserAddressService } from '@plastik/shared/pocketbase-user-addresses';
import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';

describe('pocketBaseUserProfileStore \u2014 email change', () => {
  const requestEmailChange = vi.fn();
  const confirmEmailChange = vi.fn();
  const usersCollection = { requestEmailChange, confirmEmailChange, authRefresh: vi.fn() };

  /**
   * Configure the testing module with mocked dependencies and return the store instance.
   * @returns {object} The injected user profile store instance.
   */
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: POCKETBASE_INSTANCE,
          useValue: { collection: () => usersCollection, authStore: { isValid: false } },
        },
        { provide: StoreNotificationService, useValue: { create: vi.fn() } },
        { provide: PocketBaseUserAddressService, useValue: {} },
      ],
    });
    return TestBed.inject(pocketBaseUserProfileStore);
  }

  it('requestEmailChange delegates to pb and returns true on success', async () => {
    requestEmailChange.mockResolvedValueOnce(true);
    const store = setup();
    const ok = await store.requestEmailChange('new@mail.com');
    expect(requestEmailChange).toHaveBeenCalledWith('new@mail.com');
    expect(ok).toBe(true);
  });

  it('requestEmailChange returns false on error', async () => {
    requestEmailChange.mockRejectedValueOnce(new Error('boom'));
    const store = setup();
    expect(await store.requestEmailChange('new@mail.com')).toBe(false);
  });

  it('confirmEmailChange delegates token+password and returns true on success', async () => {
    confirmEmailChange.mockResolvedValueOnce(true);
    const store = setup();
    const ok = await store.confirmEmailChange({ token: 'tok', password: 'pw' });
    expect(confirmEmailChange).toHaveBeenCalledWith('tok', 'pw');
    expect(ok).toBe(true);
  });

  it('confirmEmailChange returns false on error', async () => {
    confirmEmailChange.mockRejectedValueOnce(new Error('bad token'));
    const store = setup();
    expect(await store.confirmEmailChange({ token: 'tok', password: 'pw' })).toBe(false);
  });
});
