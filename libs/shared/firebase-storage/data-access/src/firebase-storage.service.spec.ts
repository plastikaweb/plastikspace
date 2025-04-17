import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as firebaseStorage from '@angular/fire/storage';

import { FirebaseStorageService } from './firebase-storage.service';

// Mocks de Firebase Storage
const mockUploadTask = {
  then: jest.fn(),
  catch: jest.fn(),
  snapshot: { ref: {} },
};

const mockStorageRef = {};

const mockStorage = {
  ref: jest.fn(() => mockStorageRef),
};

jest.mock('@angular/fire/storage', () => ({
  ref: jest.fn(() => mockStorageRef),
  uploadBytesResumable: jest.fn(() => mockUploadTask),
  percentage: jest.fn(() => ({
    pipe: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
  })),
  getDownloadURL: jest.fn(async () => 'https://fake-url.com/fake.png'),
  listAll: jest.fn(async () => ({ items: [{}, {}] })),
}));

describe('FirebaseStorageService', () => {
  let service: FirebaseStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        FirebaseStorageService,
        { provide: firebaseStorage.Storage, useValue: mockStorage },
      ],
    });
    service = TestBed.inject(FirebaseStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload a file and set fileUrl', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    // Mock upload task
    (firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValue({
      then: (cb: (snapshot: unknown) => void) => cb({ ref: {} }),
      catch: jest.fn(),
      snapshot: { ref: {} },
    });
    // Mock getDownloadURL
    (firebaseStorage.getDownloadURL as jest.Mock).mockResolvedValue(
      'https://fake-url.com/fake.png'
    );

    await service.upload(file, 'images');
    expect(service.fileUrl()).toBe('https://fake-url.com/fake.png');
  });

  it('should set progress during upload', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let progressCallback: (progress: number) => void = () => {};
    (firebaseStorage.percentage as jest.Mock).mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: (cb: (progress: number) => void) => {
        progressCallback = cb;
      },
    });
    (firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValue({
      then: (cb: (snapshot: unknown) => void) => cb({ ref: {} }),
      catch: jest.fn(),
      snapshot: { ref: {} },
    });
    (firebaseStorage.getDownloadURL as jest.Mock).mockResolvedValue(
      'https://fake-url.com/fake.png'
    );

    // Lanzar el callback de progreso
    await service.upload(file, 'images');
    progressCallback(55);
    expect(service.progress()).toBe(55);
  });

  it('should throw error if file is not found in upload', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await service.upload(null);
    expect(spy).toHaveBeenCalledWith(expect.any(Error));
    spy.mockRestore();
  });

  it('should get file url and set fileUrl', async () => {
    (firebaseStorage.listAll as jest.Mock).mockResolvedValue({ items: [{}] });
    (firebaseStorage.getDownloadURL as jest.Mock).mockResolvedValue(
      'https://fake-url.com/file.png'
    );
    const url = await service.getFileUrl('file.png', 'images');
    expect(url).toBe('https://fake-url.com/file.png');
    expect(service.fileUrl()).toBe('https://fake-url.com/file.png');
  });

  it('should throw error if file is not found in getFileUrl', async () => {
    (firebaseStorage.listAll as jest.Mock).mockResolvedValue({ items: [] });
    await expect(service.getFileUrl('no-file.png', 'images')).rejects.toThrow('File not found');
  });
});
