import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';

import { FirebaseStorageService } from './firebase-storage.service';

jest.mock('@angular/fire/storage', () => ({
  ...jest.requireActual('@angular/fire/storage'),
  ref: jest.fn(() => ({ fullPath: 'test-folder/test.txt' })),
  uploadBytesResumable: jest.fn(() =>
    Promise.resolve({ ref: { fullPath: 'test-folder/test.txt' } })
  ),
  percentage: jest.fn(() => of({ progress: 100 })),
  getDownloadURL: jest.fn(() => Promise.resolve('https://test-url.com/test.txt')),
  listAll: jest.fn(() => Promise.resolve({ items: [{ fullPath: 'test-folder/test.txt' }] })),
}));

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
