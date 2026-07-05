import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { beforeEach, describe, expect, it } from 'vitest';
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
