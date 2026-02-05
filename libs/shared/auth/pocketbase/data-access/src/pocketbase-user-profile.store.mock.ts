/// <reference types="jest" />
import { signal } from '@angular/core';

export const mockPocketBaseUserProfileStore = {
  user: signal(null),
  isAuthenticated: signal(false),
  isLoading: signal(false),
  addresses: signal([]),
  addressesLoaded: signal(false),
  userInitials: signal(''),
  userFirstName: signal(''),
  getUserContacts: signal([]),
  login: jest.fn(),
  logout: jest.fn(),
  checkAuth: jest.fn(),
  getUserAddresses: jest.fn(),
};
