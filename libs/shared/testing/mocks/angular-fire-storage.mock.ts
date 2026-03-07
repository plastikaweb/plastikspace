import { of } from 'rxjs';
import { vi } from 'vitest';

vi.mock('@angular/fire/storage', () => {
  return {
    Storage: vi.fn(), // Mock the Storage class
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(() => of('http://mock-url.com')),
  };
});

export const angularFireStorageMock = {};
