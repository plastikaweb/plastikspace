import { signal } from '@angular/core';

export const mockPocketBaseUserProfileStore = {
  user: signal(null),
  isAuthenticated: signal(false),
  isLoading: signal(false),
  addresses: signal([]),
  addressesLoaded: signal(false),
  userInitials: signal(''),
  userFirstName: signal(''),
  isTrial: signal(false),
  trialEndsAtDate: signal(null),
  isTrialExpired: signal(false),
  trialDaysLeft: signal(0),
  roleIcon: signal(''),
  getUserContacts: signal([]),
  login: vi.fn(),
  requestEmailChange: vi.fn(),
  confirmEmailChange: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn(),
  getUserAddresses: vi.fn(),
  convertTrialToActive: vi.fn(),
};
