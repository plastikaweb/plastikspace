import {
  updateState,
  withDevtools,
  withDevToolsStub,
  withImmutableState,
} from '@angular-architects/ngrx-toolkit';
import { inject, isDevMode } from '@angular/core';
import { signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import { LoginData, RequestPasswordData, ResetPasswordData } from '@plastik/auth/entities';
import {
  PocketBaseUser,
  PocketBaseUserAddress,
  UserContact,
  UserContactForm,
} from '@plastik/core/entities';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { PocketBaseUserAddressService } from '@plastik/shared/pocketbase-user-addresses';
import { differenceInDays, isAfter } from 'date-fns';
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
  isDevMode() ? withDevtools('user-profile') : withDevToolsStub('user-profile'),
  withImmutableState<UserProfileState>(initialState),
  withProps(() => ({
    _userAddressService: inject(PocketBaseUserAddressService),
    _authService: inject(PocketBaseAuthService),
    _notificationService: inject(StoreNotificationService),
  })),
  withComputed(store => ({
    userInitials: () =>
      store
        .user()
        ?.name?.split(' ')
        .map(name => name.charAt(0))
        .join(''),
    userFirstName: () => store.user()?.name?.split(' ')[0] || '',
    isTrial: () => store.user()?.membershipStatus === 'TRIAL',
    trialEndsAtDate: () => store.user()?.trialEndsAt,
  })),
  withComputed(store => ({
    isTrialExpired: () => {
      const endsAt = store.trialEndsAtDate();
      return store.isTrial() && !!endsAt && isAfter(new Date(), endsAt);
    },
    trialDaysLeft: () => {
      const endsAt = store.trialEndsAtDate();
      if (!store.isTrial() || !endsAt) return 0;
      const days = differenceInDays(endsAt, new Date());
      return days > 0 ? days : 0;
    },
  })),
  withComputed(store => ({
    getUserContacts: () =>
      store
        .addresses()
        .map(address => ({
          id: address.id,
          name: address.name,
          address: address.address,
          zip: address.zip,
          city: address.city,
          phone: address.phone,
          default: address.default,
        }))
        .sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)) as UserContact[],
  })),
  withMethods(store => ({
    async login(credentials: LoginData): Promise<void> {
      updateState(store, `[profile] login in process`, { isLoading: true });

      try {
        const authData = await store._authService.login(credentials.email, credentials.password);

        updateState(store, `[profile] login success`, {
          user: authData.record as PocketBaseUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        updateState(store, `[profile] login failed ${error}`, { isLoading: false });
        store._notificationService.create('auth.error.login', 'ERROR');
      }
    },

    async requestPassword(data: RequestPasswordData): Promise<void> {
      updateState(store, `[profile] reset password in process`, { isLoading: true });

      try {
        await store._authService.requestPassword(data.email);
        updateState(store, `[profile] reset password success`, { isLoading: false });
      } catch (error) {
        updateState(store, `[profile] reset password failed ${error}`, { isLoading: false });
      }
    },

    async resetPassword(data: ResetPasswordData): Promise<boolean> {
      updateState(store, `[profile] confirm password reset in process`, { isLoading: true });

      try {
        await store._authService.confirmPasswordReset(
          data.token,
          data.password,
          data.confirmPassword
        );
        updateState(store, `[profile] confirm password reset success`, { isLoading: false });
        return true;
      } catch (error) {
        updateState(store, `[profile] confirm password reset failed ${error}`, {
          isLoading: false,
        });
        return false;
      }
    },

    async updateAvatar(file: File): Promise<boolean> {
      updateState(store, `[profile] update avatar in process`, { isLoading: true });

      try {
        const id = store.user()?.id;
        if (!id) throw new Error('User not found');

        const updatedUser = await store._authService.updateAvatar(id, file);

        updateState(store, `[profile] update avatar success`, {
          user: updatedUser as PocketBaseUser,
          isLoading: false,
        });

        store._notificationService.create('profile.success.update', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] update avatar failed ${error}`, { isLoading: false });
        store._notificationService.create('profile.error.update', 'ERROR');
        return false;
      }
    },

    async deleteAvatar(): Promise<boolean> {
      updateState(store, `[profile] delete avatar in process`, { isLoading: true });

      try {
        const id = store.user()?.id;
        if (!id) throw new Error('User not found');

        const updatedUser = await store._authService.deleteAvatar(id);

        updateState(store, `[profile] delete avatar success`, {
          user: updatedUser as PocketBaseUser,
          isLoading: false,
        });

        store._notificationService.create('profile.success.update', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] delete avatar failed ${error}`, { isLoading: false });
        store._notificationService.create('profile.error.update', 'ERROR');
        return false;
      }
    },

    async updateProfile(data: { name: string; phone: string }): Promise<boolean> {
      updateState(store, `[profile] update profile in process`, { isLoading: true });

      try {
        const id = store.user()?.id;
        if (!id) throw new Error('User not found');

        const updatedUser = await store._authService.updateProfile(id, data);

        updateState(store, `[profile] update profile success`, {
          user: updatedUser as PocketBaseUser,
          isLoading: false,
        });

        store._notificationService.create('profile.success.update', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] update profile failed ${error}`, {
          isLoading: false,
        });
        store._notificationService.create('profile.error.update', 'ERROR');
        return false;
      }
    },

    logout(): void {
      store._authService.logout();
      updateState(store, `[profile] logout`, initialState);
    },

    checkAuth(): void {
      if (store._authService.loggedIn()) {
        updateState(store, `[profile] user is logged in`, {
          user: store._authService.authModel as PocketBaseUser,
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
          store._userAddressService.getFullList({
            filter: `user ="${store.user()?.id}"`,
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
        store._notificationService.create('auth.error.userAddresses', 'ERROR');
      }
    },

    async createAddress(data: UserContactForm): Promise<boolean> {
      const userId = store.user()?.id;
      if (!userId) {
        store._notificationService.create('profile.addresses.error.create', 'ERROR');
        return false;
      }

      const previousAddresses = store.addresses();
      const optimisticAddress = { ...data, user: userId } as PocketBaseUserAddress;
      const updatedAddresses = data.default
        ? previousAddresses.map(a => ({ ...a, default: false }))
        : previousAddresses;

      updateState(store, `[profile] create address optimistic`, {
        addresses: [...updatedAddresses, optimisticAddress],
        isLoading: true,
      });

      try {
        const created = await lastValueFrom(
          store._userAddressService.create(optimisticAddress as Partial<PocketBaseUserAddress>)
        );

        const currentAddresses = store.addresses();
        updateState(store, `[profile] create address success`, {
          addresses: [
            ...currentAddresses.slice(0, currentAddresses.length - 1),
            created,
          ],
          isLoading: false,
        });

        store._notificationService.create('profile.addresses.success.create', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] create address failed ${error}`, {
          addresses: previousAddresses,
          isLoading: false,
        });
        store._notificationService.create('profile.addresses.error.create', 'ERROR');
        return false;
      }
    },

    async deleteAddress(id: string): Promise<boolean> {
      updateState(store, `[profile] delete address in process`, { isLoading: true });

      try {
        await lastValueFrom(store._userAddressService.delete(id));

        updateState(store, `[profile] delete address success`, {
          addresses: store.addresses().filter(a => a.id !== id),
          isLoading: false,
        });

        store._notificationService.create('profile.addresses.success.delete', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] delete address failed ${error}`, { isLoading: false });
        store._notificationService.create('profile.addresses.error.delete', 'ERROR');
        return false;
      }
    },

    async setDefaultAddress(id: string): Promise<boolean> {
      updateState(store, `[profile] set default address in process`, { isLoading: true });

      try {
        await lastValueFrom(
          store._userAddressService.update(id, { default: true } as Partial<PocketBaseUserAddress>)
        );

        updateState(store, `[profile] set default address success`, {
          addresses: store.addresses().map(a => ({
            ...a,
            default: a.id === id ? true : false,
          })),
          isLoading: false,
        });

        store._notificationService.create('profile.addresses.success.setDefault', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] set default address failed ${error}`, { isLoading: false });
        store._notificationService.create('profile.addresses.error.setDefault', 'ERROR');
        return false;
      }
    },
  })),
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
