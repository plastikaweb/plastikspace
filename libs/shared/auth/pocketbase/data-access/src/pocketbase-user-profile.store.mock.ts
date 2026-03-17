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
  login: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn(),
  getUserAddresses: vi.fn(),
};
