import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';

import { FirebaseStorageService } from './firebase-storage.service';

vi.mock('@angular/fire/storage', async importOriginal => {
  const actual = await importOriginal<typeof import('@angular/fire/storage')>();
  return {
    ...actual,
    ref: vi.fn(() => ({ fullPath: 'test-folder/test.txt' })),
    uploadBytesResumable: vi.fn(() =>
      Promise.resolve({ ref: { fullPath: 'test-folder/test.txt' } })
    ),
    percentage: vi.fn(() => of({ progress: 100 })),
    getDownloadURL: vi.fn(() => Promise.resolve('https://test-url.com/test.txt')),
    listAll: vi.fn(() => Promise.resolve({ items: [{ fullPath: 'test-folder/test.txt' }] })),
  };
});

describe('FirebaseStorageService', () => {
  let service: FirebaseStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        FirebaseStorageService,
        {
          provide: Storage,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(FirebaseStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload a file', async () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    await service.upload(file, 'test-folder');
    expect(service.progress()).toBe(0);
  });

  it('should reset progress and error', () => {
    service.progress.set(50);
    service.reset();
    expect(service.progress()).toBe(0);
  });
});
