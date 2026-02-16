import { updateState, withImmutableState, withReset } from '@angular-architects/ngrx-toolkit';
import { signalStore, withMethods } from '@ngrx/signals';

export interface ActivityState {
  isActive: boolean;
}

export const activityStore = signalStore(
  { providedIn: 'root' },
  withImmutableState<ActivityState>({
    isActive: false,
  }),
  withReset(),
  withMethods(store => ({
    setActivity(isActive: boolean) {
      updateState(store, `[activity] ${isActive ? 'on' : 'off'}`, { isActive });
    },
  }))
);
