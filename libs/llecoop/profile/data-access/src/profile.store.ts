/* eslint-disable no-console */
import { filter, pipe, switchMap, tap } from 'rxjs';

import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import { StoreNotificationService } from '@plastik/shared/signal-state-data-access';

import { LlecoopProfileFireService } from './profile-fire.service';

export interface ProfileState {
  user: LlecoopUser | null;
  _activeConnection: boolean;
}

const initState: ProfileState = {
  user: null,
  _activeConnection: false,
};

export const llecoopProfileStore = signalStore(
  { providedIn: 'root' },
  withDevtools('profile'),
  withState<ProfileState>(initState),
  withProps(() => ({
    _storeNotificationService: inject(StoreNotificationService),
    _profileService: inject(LlecoopProfileFireService),
    _authService: inject(FirebaseAuthService),
    _activityStore: inject(activityStore),
  })),
  withComputed(({ user }) => ({
    getUserName: computed(() => user()?.name || user()?.email || 'user'),
  })),
  withMethods(store => ({
    getItem: rxMethod<void>(
      pipe(
        filter(() => store._activeConnection()),
        tap(() => store._activityStore.setActivity(true)),
        switchMap(() => {
          return store._profileService.getLoggedUser().pipe(
            tapResponse({
              next: user => {
                updateState(store, `[profile] get user`, { user });
                store._activityStore.setActivity(false);
              },
              error: error => {
                store._activityStore.setActivity(false);

                if (store._activeConnection()) {
                  store._storeNotificationService.create(
                    `No s'ha pogut carregar el perfil: ${error}`,
                    'ERROR'
                  );
                }
              },
            })
          );
        })
      )
    ),
    update: rxMethod<Partial<LlecoopUser>>(
      pipe(
        filter(() => store._activeConnection()),
        tap(() => store._activityStore.setActivity(true)),
        switchMap(user => {
          return store._profileService.update(user).pipe(
            tapResponse({
              next: () => {
                store._activityStore.setActivity(false);
                store._storeNotificationService.create(`S'ha actualitzat el perfil`, 'SUCCESS');
              },
              error: error => {
                store._activityStore.setActivity(false);
                store._storeNotificationService.create(
                  `No s'ha pogut actualitzar el perfil: ${error}`,
                  'ERROR'
                );
              },
            })
          );
        })
      )
    ),
    setActive(): void {
      store._profileService.setActiveConnection(true);

      updateState(store, `[profile] setActive`, {
        _activeConnection: true,
      });
    },
    destroy(): void {
      try {
        store._profileService.setActiveConnection(false);

        updateState(store, `[profile] reset store`, initState);
      } catch (error) {
        console.error('Profile destroy error', error);
      }
    },
  })),
  withHooks({
    onInit(store) {
      watchState(store, () => {
        if (store._activeConnection() && !store.user()) {
          store.getItem();
        }
      });

      effect(() => {
        if (!store._authService.currentUser()) {
          store.destroy();
        } else if (!store._activeConnection()) {
          store.setActive();
        }
      });
    },
  })
);
