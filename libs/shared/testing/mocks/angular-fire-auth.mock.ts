import { of } from 'rxjs';
import { vi } from 'vitest';

vi.mock('@angular/fire/auth', () => {
  return {
    Auth: vi.fn(), // Mock the Auth class
    authState: of(null), // Mock common methods like authState
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  };
});

export const angularFireAuthMock = {};
