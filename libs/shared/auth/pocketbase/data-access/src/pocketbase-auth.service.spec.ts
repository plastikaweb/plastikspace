import { TestBed } from '@angular/core/testing';
import { PocketBaseAuthService } from './pocketbase-auth.service';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';

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

  it('should return authModel', () => {
    expect(service.authModel).toEqual({ id: '123', email: 'test@test.com' });
    mockPocketBase.authStore.record = null;
    expect(service.authModel).toBeNull();
  });
});
