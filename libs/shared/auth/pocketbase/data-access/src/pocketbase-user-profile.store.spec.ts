import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { PocketBaseUserFiscalProfile, UserFiscalProfileForm } from '@plastik/core/entities';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { PocketBaseUserAddressService } from '@plastik/shared/pocketbase-user-addresses';
import { PocketBaseUserFiscalProfileService } from '@plastik/shared/pocketbase-user-fiscal-profiles';
import { of, throwError } from 'rxjs';
import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';

describe('pocketBaseUserProfileStore \u2014 email change', () => {
  const requestEmailChange = vi.fn();
  const confirmEmailChange = vi.fn();
  const update = vi.fn();
  const createNotification = vi.fn();
  const usersCollection = { requestEmailChange, confirmEmailChange, update, authRefresh: vi.fn() };

  /**
   * Configure the testing module with mocked dependencies and return the store instance.
   * @param {object} [authStore] The mocked PocketBase authStore state.
   * @param {boolean} authStore.isValid Whether the mocked session is valid.
   * @param {unknown} [authStore.record] The mocked authenticated user record.
   * @returns {object} The injected user profile store instance.
   */
  function setup(authStore: { isValid: boolean; record?: unknown } = { isValid: false }) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: POCKETBASE_INSTANCE,
          useValue: { collection: () => usersCollection, authStore },
        },
        { provide: StoreNotificationService, useValue: { create: createNotification } },
        { provide: PocketBaseUserAddressService, useValue: {} },
        { provide: PocketBaseUserFiscalProfileService, useValue: {} },
      ],
    });
    return TestBed.inject(pocketBaseUserProfileStore);
  }

  beforeEach(() => {
    createNotification.mockClear();
    update.mockClear();
  });

  it('requestEmailChange delegates to pb and returns true on success', async () => {
    requestEmailChange.mockResolvedValueOnce(true);
    const store = setup();
    const ok = await store.requestEmailChange('new@mail.com');
    expect(requestEmailChange).toHaveBeenCalledWith('new@mail.com');
    expect(ok).toBe(true);
    expect(createNotification).toHaveBeenCalledWith(
      'profile.accessSecurity.success.requested',
      'SUCCESS'
    );
  });

  it('requestEmailChange returns false on error and shows the generic toast', async () => {
    requestEmailChange.mockRejectedValueOnce(new Error('boom'));
    const store = setup();
    expect(await store.requestEmailChange('new@mail.com')).toBe(false);
    expect(createNotification).toHaveBeenCalledWith(
      'profile.accessSecurity.error.requested',
      'ERROR'
    );
  });

  it('requestEmailChange maps the 400 invalid-new-email response to its own toast', async () => {
    requestEmailChange.mockRejectedValueOnce({
      status: 400,
      data: { data: { newEmail: { code: 'validation_invalid_new_email' } } },
    });
    const store = setup();
    expect(await store.requestEmailChange('used@mail.com')).toBe(false);
    expect(createNotification).toHaveBeenCalledWith(
      'profile.accessSecurity.error.invalidNewEmail',
      'ERROR'
    );
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

  it('updateLanguage PATCHes users.language silently and updates the state', async () => {
    const record = { id: 'u1', email: 'old@mail.com', language: 'ca' };
    update.mockResolvedValueOnce({ ...record, language: 'es' });
    const store = setup({ isValid: true, record });

    expect(await store.updateLanguage('es')).toBe(true);
    expect(update).toHaveBeenCalledWith('u1', { language: 'es' });
    expect(store.user()?.language).toBe('es');
    expect(createNotification).not.toHaveBeenCalled();
  });

  it('updateLanguage no-ops when the language already matches', async () => {
    const record = { id: 'u1', email: 'old@mail.com', language: 'ca' };
    const store = setup({ isValid: true, record });

    expect(await store.updateLanguage('ca')).toBe(false);
    expect(update).not.toHaveBeenCalled();
  });
});

describe('pocketBaseUserProfileStore — password change', () => {
  const update = vi.fn();
  const authWithPassword = vi.fn();
  const createNotification = vi.fn();
  const usersCollection = { update, authWithPassword };
  const record = { id: 'u1', email: 'user@mail.com' };
  const changeData = {
    oldPassword: 'test-current-pw',
    password: 'test-new-pw',
    passwordConfirm: 'test-new-pw',
  };

  /**
   * Configure the testing module with mocked dependencies and return the store instance.
   * @param {object} [authStore] The mocked PocketBase authStore state.
   * @param {boolean} authStore.isValid Whether the mocked session is valid.
   * @param {unknown} [authStore.record] The mocked authenticated user record.
   * @returns {object} The injected user profile store instance.
   */
  function setup(authStore: { isValid: boolean; record?: unknown } = { isValid: true, record }) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: POCKETBASE_INSTANCE,
          useValue: { collection: () => usersCollection, authStore },
        },
        { provide: StoreNotificationService, useValue: { create: createNotification } },
        { provide: PocketBaseUserAddressService, useValue: {} },
        { provide: PocketBaseUserFiscalProfileService, useValue: {} },
      ],
    });
    return TestBed.inject(pocketBaseUserProfileStore);
  }

  beforeEach(() => {
    update.mockReset();
    authWithPassword.mockReset();
    createNotification.mockClear();
  });

  it('changePassword PATCHes the password fields, re-authenticates and keeps the session', async () => {
    update.mockResolvedValueOnce({ ...record });
    authWithPassword.mockResolvedValueOnce({ record: { ...record }, token: 'fresh-token' });
    const store = setup();

    expect(await store.changePassword(changeData)).toBe(true);
    expect(update).toHaveBeenCalledWith('u1', changeData);
    expect(authWithPassword).toHaveBeenCalledWith('user@mail.com', 'test-new-pw');
    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.id).toBe('u1');
    expect(createNotification).toHaveBeenCalledWith(
      'profile.accessSecurity.password.success.changed',
      'SUCCESS'
    );
  });

  it('changePassword maps the 400 invalid-old-password response to its own toast', async () => {
    update.mockRejectedValueOnce({
      status: 400,
      data: { data: { oldPassword: { code: 'validation_invalid_old_password' } } },
    });
    const store = setup();

    expect(await store.changePassword(changeData)).toBe(false);
    expect(authWithPassword).not.toHaveBeenCalled();
    expect(createNotification).toHaveBeenCalledWith(
      'profile.accessSecurity.password.error.invalidOldPassword',
      'ERROR'
    );
  });

  it('changePassword returns false on generic error and shows the generic toast', async () => {
    update.mockRejectedValueOnce(new Error('boom'));
    const store = setup();

    expect(await store.changePassword(changeData)).toBe(false);
    expect(createNotification).toHaveBeenCalledWith(
      'profile.accessSecurity.password.error.changed',
      'ERROR'
    );
  });
});

describe('pocketBaseUserProfileStore — fiscal profile', () => {
  const getFirstListItem = vi.fn();
  const create = vi.fn();
  const update = vi.fn();
  const createNotification = vi.fn();
  const fiscalProfileService = { getFirstListItem, create, update };
  const record = { id: 'u1', email: 'user@mail.com' };

  const fiscalProfileFixture: PocketBaseUserFiscalProfile = {
    id: 'fp1',
    collectionId: 'test-collection-id',
    collectionName: 'user_fiscal_profiles',
    created: new Date('2026-01-01'),
    updated: new Date('2026-01-01'),
    fiscalName: 'Test Fiscal SL',
    nif: '12345678Z',
    address: 'Carrer Test 1',
    city: 'Barcelona',
    zip: '08001',
    user: 'u1',
  };

  const formFixture: UserFiscalProfileForm = {
    fiscalName: 'Test Fiscal SL',
    nif: '12345678Z',
    address: 'Carrer Test 1',
    city: 'Barcelona',
    zip: '08001',
  };

  /**
   * Configure the testing module with mocked dependencies and return the store instance.
   * @param {object} [authStore] The mocked PocketBase authStore state.
   * @param {boolean} authStore.isValid Whether the mocked session is valid.
   * @param {unknown} [authStore.record] The mocked authenticated user record.
   * @returns {object} The injected user profile store instance.
   */
  function setup(authStore: { isValid: boolean; record?: unknown } = { isValid: true, record }) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: POCKETBASE_INSTANCE,
          useValue: { collection: () => ({}), authStore },
        },
        { provide: StoreNotificationService, useValue: { create: createNotification } },
        { provide: PocketBaseUserAddressService, useValue: {} },
        { provide: PocketBaseUserFiscalProfileService, useValue: fiscalProfileService },
      ],
    });
    return TestBed.inject(pocketBaseUserProfileStore);
  }

  beforeEach(() => {
    getFirstListItem.mockReset();
    create.mockReset();
    update.mockReset();
    createNotification.mockClear();
  });

  it('getFiscalProfile stores the record and marks loaded', async () => {
    getFirstListItem.mockReturnValueOnce(of(fiscalProfileFixture));
    const store = setup();

    await store.getFiscalProfile();

    expect(getFirstListItem).toHaveBeenCalledWith('user="u1"');
    expect(store.fiscalProfile()).toEqual(fiscalProfileFixture);
    expect(store.fiscalProfileLoaded()).toBe(true);
  });

  it('getFiscalProfile treats a 404 as empty, not an error', async () => {
    getFirstListItem.mockReturnValueOnce(throwError(() => ({ status: 404 })));
    const store = setup();

    await store.getFiscalProfile();

    expect(store.fiscalProfile()).toBeNull();
    expect(store.fiscalProfileLoaded()).toBe(true);
  });

  it('saveFiscalProfile creates when none exists and normalizes the nif', async () => {
    const created = { ...fiscalProfileFixture };
    create.mockReturnValueOnce(of(created));
    const store = setup();

    const ok = await store.saveFiscalProfile({ ...formFixture, nif: ' 12345678z ' });

    expect(ok).toBe(true);
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ nif: '12345678Z', user: 'u1' }));
    expect(store.fiscalProfile()).toEqual(created);
    expect(createNotification).toHaveBeenCalledWith('profile.fiscalData.success.save', 'SUCCESS');
  });

  it('saveFiscalProfile updates when a profile exists', async () => {
    getFirstListItem.mockReturnValueOnce(of(fiscalProfileFixture));
    const store = setup();
    await store.getFiscalProfile();

    const updated = { ...fiscalProfileFixture, fiscalName: 'Updated SL' };
    update.mockReturnValueOnce(of(updated));

    const ok = await store.saveFiscalProfile(formFixture);

    expect(ok).toBe(true);
    expect(update).toHaveBeenCalledWith(
      'fp1',
      expect.objectContaining({ nif: '12345678Z', user: 'u1' })
    );
    expect(store.fiscalProfile()).toEqual(updated);
  });
});
