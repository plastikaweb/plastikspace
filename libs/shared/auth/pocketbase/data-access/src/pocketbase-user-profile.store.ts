import {
  updateState,
  withDevtools,
  withDevToolsStub,
  withImmutableState,
} from '@angular-architects/ngrx-toolkit';
import { inject, isDevMode } from '@angular/core';
import { signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import {
  ChangePasswordData,
  ConfirmEmailChangeData,
  LoginData,
  RequestPasswordData,
  ResetPasswordData,
} from '@plastik/auth/entities';
import {
  PocketBaseUser,
  PocketBaseUserAddress,
  PocketBaseUserFiscalProfile,
  UserContact,
  UserContactForm,
  UserFiscalProfileForm,
} from '@plastik/core/entities';
import { StoreNotificationService } from '@plastik/shared/notification/data-access';
import { PocketBaseUserAddressService } from '@plastik/shared/pocketbase-user-addresses';
import { PocketBaseUserFiscalProfileService } from '@plastik/shared/pocketbase-user-fiscal-profiles';
import { differenceInDays, isAfter } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { PocketBaseAuthService } from './pocketbase-auth.service';

export interface UserProfileState {
  user: PocketBaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  addresses: PocketBaseUserAddress[];
  addressesLoaded: boolean;
  fiscalProfile: PocketBaseUserFiscalProfile | null;
  fiscalProfileLoaded: boolean;
}

const initialState: UserProfileState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  addresses: [],
  addressesLoaded: false,
  fiscalProfile: null,
  fiscalProfileLoaded: false,
};

export const pocketBaseUserProfileStore = signalStore(
  { providedIn: 'root' },
  isDevMode() ? withDevtools('user-profile') : withDevToolsStub('user-profile'),
  withImmutableState<UserProfileState>(initialState),
  withProps(() => ({
    _userAddressService: inject(PocketBaseUserAddressService),
    _userFiscalProfileService: inject(PocketBaseUserFiscalProfileService),
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
    roleIcon: () => {
      if (store.isTrial()) return 'history_toggle_off';
      const role = store.user()?.role;
      switch (role) {
        case 'PARTNER':
          return 'verified';
        case 'GLOBAL_ADMIN':
          return 'admin_panel_settings';
        case 'TENANT_ADMIN':
          return 'manage_accounts';
        default:
          return '';
      }
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

    async requestEmailChange(newEmail: string): Promise<boolean> {
      updateState(store, `[profile] request email change in process`, { isLoading: true });

      try {
        await store._authService.requestEmailChange(newEmail);
        updateState(store, `[profile] request email change success`, { isLoading: false });
        store._notificationService.create('profile.accessSecurity.success.requested', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] request email change failed ${error}`, { isLoading: false });
        // PocketBase answers 400 validation_invalid_new_email both for malformed and
        // already-registered addresses (it deliberately doesn't reveal which).
        const isInvalidNewEmail =
          (error as { status?: number; data?: { data?: { newEmail?: unknown } } }).status === 400 &&
          !!(error as { data?: { data?: { newEmail?: unknown } } }).data?.data?.['newEmail'];
        store._notificationService.create(
          isInvalidNewEmail
            ? 'profile.accessSecurity.error.invalidNewEmail'
            : 'profile.accessSecurity.error.requested',
          'ERROR'
        );
        return false;
      }
    },

    async confirmEmailChange(data: ConfirmEmailChangeData): Promise<boolean> {
      updateState(store, `[profile] confirm email change in process`, { isLoading: true });

      try {
        await store._authService.confirmEmailChange(data.token, data.password);
        updateState(store, `[profile] confirm email change success`, { isLoading: false });
        return true;
      } catch (error) {
        updateState(store, `[profile] confirm email change failed ${error}`, { isLoading: false });
        return false;
      }
    },

    async changePassword(data: ChangePasswordData): Promise<boolean> {
      updateState(store, `[profile] change password in process`, { isLoading: true });

      try {
        const user = store.user();
        if (!user?.id || !user?.email) throw new Error('User not found');

        const authData = await store._authService.changePassword(user.id, user.email, data);

        updateState(store, `[profile] change password success`, {
          user: authData.record as PocketBaseUser,
          isAuthenticated: true,
          isLoading: false,
        });

        store._notificationService.create(
          'profile.accessSecurity.password.success.changed',
          'SUCCESS'
        );
        return true;
      } catch (error) {
        updateState(store, `[profile] change password failed ${error}`, { isLoading: false });
        // PocketBase answers 400 with a data.oldPassword entry when the current
        // password doesn't match; anything else gets the generic toast.
        const isInvalidOldPassword =
          (error as { status?: number; data?: { data?: { oldPassword?: unknown } } }).status ===
            400 &&
          !!(error as { data?: { data?: { oldPassword?: unknown } } }).data?.data?.['oldPassword'];
        store._notificationService.create(
          isInvalidOldPassword
            ? 'profile.accessSecurity.password.error.invalidOldPassword'
            : 'profile.accessSecurity.password.error.changed',
          'ERROR'
        );
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

    async updateLanguage(language: string): Promise<boolean> {
      const user = store.user();
      if (!user?.id || user.language === language) return false;

      try {
        const updatedUser = await store._authService.updateLanguage(user.id, language);
        // Silent sync: no toast and no isLoading — a language switch must not flash the UI.
        updateState(store, `[profile] update language success`, {
          user: updatedUser as PocketBaseUser,
        });
        return true;
      } catch (error) {
        updateState(store, `[profile] update language failed ${error}`, {});
        return false;
      }
    },

    async convertTrialToActive(): Promise<boolean> {
      updateState(store, `[profile] convert trial to active in process`, { isLoading: true });

      try {
        const id = store.user()?.id;
        if (!id) throw new Error('User not found');

        const updatedUser = await store._authService.convertTrialToActive(id);

        updateState(store, `[profile] convert trial to active success`, {
          user: updatedUser as PocketBaseUser,
          isLoading: false,
        });

        store._notificationService.create('store.trial.snackbar.success', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] convert trial to active failed ${error}`, {
          isLoading: false,
        });
        store._notificationService.create('store.trial.snackbar.error', 'ERROR');
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
          addresses: [...currentAddresses.slice(0, currentAddresses.length - 1), created],
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

    async updateAddress(id: string, data: UserContactForm): Promise<boolean> {
      const previousAddresses = store.addresses();

      const updatedAddresses = data.default
        ? previousAddresses.map(a => ({
            ...a,
            default: a.id === id,
            ...(a.id === id ? data : {}),
          }))
        : previousAddresses.map(a => (a.id === id ? { ...a, ...data } : a));

      updateState(store, `[profile] update address optimistic`, {
        addresses: updatedAddresses as PocketBaseUserAddress[],
        isLoading: true,
      });

      try {
        const updated = await lastValueFrom(
          store._userAddressService.update(id, data as Partial<PocketBaseUserAddress>)
        );

        updateState(store, `[profile] update address success`, {
          addresses: store.addresses().map(a => (a.id === id ? updated : a)),
          isLoading: false,
        });

        store._notificationService.create('profile.addresses.success.update', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] update address failed ${error}`, {
          addresses: previousAddresses,
          isLoading: false,
        });
        store._notificationService.create('profile.addresses.error.update', 'ERROR');
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

    async getFiscalProfile(): Promise<void> {
      const user = store.user();
      if (!user || store.fiscalProfileLoaded()) return;

      try {
        const fiscalProfile = await lastValueFrom(
          store._userFiscalProfileService.getFirstListItem(`user="${user.id}"`)
        );

        updateState(store, `[profile] load fiscal profile success`, {
          fiscalProfile,
          fiscalProfileLoaded: true,
        });
      } catch {
        // A missing fiscal profile (404) is a valid empty state, not an error to surface.
        updateState(store, `[profile] load fiscal profile empty`, {
          fiscalProfile: null,
          fiscalProfileLoaded: true,
        });
      }
    },

    async saveFiscalProfile(data: UserFiscalProfileForm): Promise<boolean> {
      const user = store.user();
      if (!user) return false;

      const payload: Partial<PocketBaseUserFiscalProfile> = {
        ...data,
        nif: data.nif.trim().toUpperCase(),
        user: user.id,
      };
      const current = store.fiscalProfile();

      try {
        const saved = current
          ? await lastValueFrom(store._userFiscalProfileService.update(current.id, payload))
          : await lastValueFrom(store._userFiscalProfileService.create(payload));

        updateState(store, `[profile] save fiscal profile success`, { fiscalProfile: saved });
        store._notificationService.create('profile.fiscalData.success.save', 'SUCCESS');
        return true;
      } catch (error) {
        updateState(store, `[profile] save fiscal profile failed ${error}`, {});
        store._notificationService.create('profile.fiscalData.error.save', 'ERROR');
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
