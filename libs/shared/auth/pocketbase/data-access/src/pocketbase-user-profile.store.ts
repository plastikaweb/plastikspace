import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { LoginData } from '@plastik/auth/entities';
import { PocketBaseUser, PocketBaseUserAddress, UserContact } from '@plastik/core/entities';
import { PocketBaseUserAddressService } from '@plastik/shared/pocketbase-user-addresses';
import { lastValueFrom } from 'rxjs';
import { PocketBaseAuthService } from './pocketbase-auth.service';

export interface UserProfileState {
  user: PocketBaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  addresses: PocketBaseUserAddress[];
  addressesLoaded: boolean;
}

const initialState: UserProfileState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  addresses: [],
  addressesLoaded: false,
};

export const pocketBaseUserProfileStore = signalStore(
  { providedIn: 'root' },
  withDevtools('user-profile'),
  withState<UserProfileState>(initialState),

  withComputed(store => ({
    userInitials: computed(() =>
      store
        .user()
        ?.name?.split(' ')
        .map(name => name.charAt(0))
        .join('')
    ),
    userFirstName: computed(() => store.user()?.name?.split(' ')[0] || ''),
  })),
  withComputed(store => ({
    getUserContacts: computed(
      () =>
        store
          .addresses()
          .map(address => ({
            id: address.id,
            name: address.name,
            fullName: address.fullName,
            address: address.address,
            zip: address.zip,
            city: address.city,
            province: address.province,
            country: address.country,
            phone: address.phone,
            default: address.default,
          }))
          .sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)) as UserContact[]
    ),
  })),
  withMethods(
    (
      store,
      authService = inject(PocketBaseAuthService),
      userAddressService = inject(PocketBaseUserAddressService)
    ) => ({
      async login(credentials: LoginData): Promise<void> {
        updateState(store, `[profile] login in process`, { isLoading: true });

        try {
          const authData = await authService.login(credentials.email, credentials.password);

          updateState(store, `[profile] login success`, {
            user: authData.record as PocketBaseUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'auth.error.login';

          throw new Error(errorMessage);
        }
      },

      logout(): void {
        authService.logout();
        updateState(store, `[profile] logout`, initialState);
      },

      checkAuth(): void {
        if (authService.loggedIn()) {
          updateState(store, `[profile] user is logged in`, {
            user: authService.authModel as PocketBaseUser,
            isAuthenticated: true,
          });
        } else {
          updateState(store, `[profile] user is not logged in`, {
            user: null,
            isAuthenticated: false,
          });
        }
      },

      async getUserAddresses(): Promise<void> {
        try {
          updateState(store, `[profile] loading user addresses`, { isLoading: true });

          const addresses = await lastValueFrom(
            userAddressService.getFullList({
              filter: `user = "${store.user()?.id}"`,
            })
          );

          updateState(store, `[profile] user addresses loaded`, {
            addresses: addresses || [],
            addressesLoaded: true,
            isLoading: false,
          });
        } catch (error) {
          updateState(store, `[profile] user addresses load failed ${error}`, {
            addressesLoaded: false,
            isLoading: false,
          });
        }
      },
    })
  ),

  withHooks({
    /**
     * On store initialization, automatically check for an existing valid session.
     * This enables automatic login restoration when the user refreshes the page.
     * @param {typeof pocketBaseUserProfileStore} store - The store instance
     * @returns {void}
     */
    onInit(store) {
      store.checkAuth();
    },
  })
);
