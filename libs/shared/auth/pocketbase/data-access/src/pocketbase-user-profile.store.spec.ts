import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { PocketBaseUserAddressService } from '@plastik/shared/pocketbase-user-addresses';
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
  const changeData = { oldPassword: 'old-pw', password: 'new-pw', passwordConfirm: 'new-pw' };

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
    expect(authWithPassword).toHaveBeenCalledWith('user@mail.com', 'new-pw');
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
