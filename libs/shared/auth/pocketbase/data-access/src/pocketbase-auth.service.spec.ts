import { TestBed } from '@angular/core/testing';
import { PocketBaseAuthService } from './pocketbase-auth.service';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';

describe('PocketBaseAuthService', () => {
  let service: PocketBaseAuthService;
  let pbMock: any;

  beforeEach(() => {
    pbMock = {
      collection: jest.fn().mockReturnValue({
        authWithPassword: jest
          .fn()
          .mockResolvedValue({ record: { id: '123', email: 'test@test.com' } }),
      }),
      authStore: {
        clear: jest.fn(),
        isValid: true,
        record: { id: '123', email: 'test@test.com' },
      },
    };

    TestBed.configureTestingModule({
      providers: [PocketBaseAuthService, { provide: POCKETBASE_INSTANCE, useValue: pbMock }],
    });
    service = TestBed.inject(PocketBaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call authWithPassword on login', async () => {
    const result = await service.login('test@test.com', 'password');
    expect(pbMock.collection).toHaveBeenCalledWith('users');
    expect(result.record).toEqual({ id: '123', email: 'test@test.com' });
  });

  it('should call clear on logout', () => {
    service.logout();
    expect(pbMock.authStore.clear).toHaveBeenCalled();
  });

  it('should return isValid from authStore', () => {
    expect(service.isValid).toBe(true);
    pbMock.authStore.isValid = false;
    expect(service.isValid).toBe(false);
  });

  it('should return authModel from authStore', () => {
    expect(service.authModel).toEqual({ id: '123', email: 'test@test.com' });
    pbMock.authStore.record = null;
    expect(service.authModel).toBeNull();
  });
});
