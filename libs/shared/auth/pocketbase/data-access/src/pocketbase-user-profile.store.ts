import { inject } from '@angular/core';
import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { PocketBaseAuthService } from './pocketbase-auth.service';
import { PocketBaseUser } from '@plastik/core/entities';

export interface UserProfileState {
  user: PocketBaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: UserProfileState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const pocketBaseUserProfileStore = signalStore(
  { providedIn: 'root' },
  withDevtools('user-profile'),
  withState<UserProfileState>(initialState),

  withMethods((store, authService = inject(PocketBaseAuthService)) => ({
    async login(credentials: { email: string; password: string }): Promise<void> {
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
