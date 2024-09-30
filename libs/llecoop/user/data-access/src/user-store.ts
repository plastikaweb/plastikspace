import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { LlecoopFeatureStore } from '@plastik/llecoop/data-access';
import { LlecoopUser } from '@plastik/llecoop/entities';

type UserState = LlecoopFeatureStore;

export const LLecoopUserStore = signalStore(
  { providedIn: 'root' },
  withDevtools('users'),
  withState<UserState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['email', 'asc'],
    selectedItemId: null,
  }),
  withEntities<LlecoopUser>(),
  withComputed(({ ids }) => ({
    count: computed(() => ids().length),
  }))
);
