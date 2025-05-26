import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withMethods, withState } from '@ngrx/signals';

export interface ActivityState {
  isActive: boolean;
}

export const activityStore = signalStore(
  { providedIn: 'root' },
  withDevtools('activity'),
  withState<ActivityState>({
    isActive: false,
  }),
  withMethods(store => ({
    setActivity(isActive: boolean) {
      updateState(store, `[activity] ${isActive ? 'on' : 'off'}`, { isActive });
    },
  }))
);
