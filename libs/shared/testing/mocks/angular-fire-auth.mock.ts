import { of } from 'rxjs';

export const angularFireAuthMock = jest.mock('@angular/fire/auth', () => {
  return {
    Auth: jest.fn(), // Mock the Auth class
    getIdTokenResult: jest.fn(), // Mock the getIdTokenResult function
    sendPasswordResetEmail: jest.fn(), // Mock the sendPasswordResetEmail function
    signInWithEmailAndPassword: jest.fn(), // Mock the signInWithEmailAndPassword function
    signOut: jest.fn(), // Mock the signOut function
    user: jest.fn(() => of(null)), // Mock the user observable, returning a null user by default
  };
});
