import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PocketBaseAuthService } from './pocketbase-auth.service';

describe('PocketBaseAuthService', () => {
  let service: PocketBaseAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PocketBaseAuthService,
        { provide: POCKETBASE_INSTANCE, useValue: mockPocketBase },
        { provide: POCKETBASE_ENVIRONMENT, useValue: { production: false, environment: 'test' } },
      ],
    });
    service = TestBed.inject(PocketBaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call authWithPassword on login', async () => {
    const result = await service.login('test@test.com', 'password');

    expect(mockPocketBase.collection).toHaveBeenCalledWith('users');
    expect(result.record).toEqual({ id: '123', email: 'test@test.com' });
  });

  it('should request a one-time code and return its id', async () => {
    const otpId = await service.requestOtp('test@test.com');

    expect(mockPocketBase.collection('users').requestOTP).toHaveBeenCalledWith('test@test.com');
    expect(otpId).toBe('test-otp-id');
  });

  it('should authenticate with the one-time code and the pending login id', async () => {
    const result = await service.loginWithOtp('test-otp-id', '12345678', 'test-mfa-id');

    expect(mockPocketBase.collection('users').authWithOTP).toHaveBeenCalledWith(
      'test-otp-id',
      '12345678',
      { mfaId: 'test-mfa-id' }
    );
    expect(result.record).toEqual({ id: '123', email: 'test@test.com' });
  });

  it('should call clear on logout', () => {
    service.logout();
    expect(mockPocketBase.authStore.clear).toHaveBeenCalled();
  });

  it('should call update and authRefresh on convertTrialToActive', async () => {
    mockPocketBase
      .collection('users')
      .update.mockResolvedValueOnce({ id: '123', email: 'test@test.com' });

    const result = await service.convertTrialToActive('123');

    expect(mockPocketBase.collection).toHaveBeenCalledWith('users');
    expect(mockPocketBase.collection('users').update).toHaveBeenCalledWith('123', {
      membershipStatus: 'ACTIVE',
      trialEndsAt: null,
    });
    expect(mockPocketBase.collection('users').authRefresh).toHaveBeenCalled();
    expect(result).toEqual({ id: '123', email: 'test@test.com' });
  });

  it('should update password fields and re-authenticate on changePassword', async () => {
    const usersCollection = mockPocketBase.collection('users');

    usersCollection.update.mockResolvedValueOnce({ id: '123' });

    const result = await service.changePassword('123', 'test@test.com', {
      oldPassword: 'test-current-pw',
      password: 'test-new-pw',
      passwordConfirm: 'test-new-pw',
    });

    expect(usersCollection.update).toHaveBeenCalledWith('123', {
      oldPassword: 'test-current-pw',
      password: 'test-new-pw',
      passwordConfirm: 'test-new-pw',
    });
    expect(usersCollection.authWithPassword).toHaveBeenCalledWith('test@test.com', 'test-new-pw');
    expect(result.record).toEqual({ id: '123', email: 'test@test.com' });
  });

  it('should return authModel', () => {
    expect(service.authModel).toEqual({ id: '123', email: 'test@test.com' });
    mockPocketBase.authStore.record = null as unknown as Record<string, unknown>;
    expect(service.authModel).toBeNull();
  });
});

describe('PocketBaseAuthService — loggedIn', () => {
  /**
   * Build the service around an auth store that can change and say so, as the SDK one does.
   * @param {boolean} isValid Whether the session is valid when the service is created.
   * @returns {object} The service, the mutable session state and the registered change listeners.
   */
  function setup(isValid: boolean) {
    const session = { isValid };
    const listeners: (() => void)[] = [];
    const unsubscribe = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        PocketBaseAuthService,
        {
          provide: POCKETBASE_INSTANCE,
          useValue: {
            authStore: {
              get isValid() {
                return session.isValid;
              },
              onChange: (listener: () => void) => {
                listeners.push(listener);

                return unsubscribe;
              },
            },
          },
        },
      ],
    });

    return { service: TestBed.inject(PocketBaseAuthService), session, listeners, unsubscribe };
  }

  it('starts from the session the SDK holds', () => {
    expect(setup(true).service.loggedIn()).toBe(true);
  });

  it('follows the auth store when it reports a change', () => {
    const { service, session, listeners } = setup(false);

    expect(service.loggedIn()).toBe(false);

    session.isValid = true;
    listeners.forEach(listener => listener());

    expect(service.loggedIn()).toBe(true);

    session.isValid = false;
    listeners.forEach(listener => listener());

    expect(service.loggedIn()).toBe(false);
  });

  it('refreshLoggedIn reads the session again when nothing reported a change', () => {
    const { service, session } = setup(true);

    expect(service.loggedIn()).toBe(true);

    session.isValid = false;

    expect(service.loggedIn()).toBe(true);
    expect(service.refreshLoggedIn()).toBe(false);
    expect(service.loggedIn()).toBe(false);
  });

  it('stops listening when it is destroyed', () => {
    const { unsubscribe } = setup(false);

    TestBed.resetTestingModule();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
