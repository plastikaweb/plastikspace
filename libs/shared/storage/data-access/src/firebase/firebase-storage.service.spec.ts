import '@plastik/shared/testing';

import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Storage } from '@angular/fire/storage';

import { FirebaseStorageService } from './firebase-storage.service';

describe('FirebaseStorageService', () => {
  let service: FirebaseStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        FirebaseStorageService,
        {
          provide: Storage,
          useValue: jest.fn(),
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
