import {
  updateState,
  withDevtools,
  withDevToolsStub,
  withImmutableState,
  withReset,
} from '@angular-architects/ngrx-toolkit';
import { isDevMode } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';

export interface ActivityState {
  isActive: boolean;
  message: string;
}

const initialState: ActivityState = {
  isActive: false,
  message: 'loading-data',
};

export const activityStore = signalStore(
  { providedIn: 'root' },
  isDevMode() ? withDevtools('activity') : withDevToolsStub('activity'),
  withImmutableState<ActivityState>(initialState),
  withReset(),
  withMethods(store => ({
    setActivity(isActive: boolean, message?: string) {
      updateState(store, `[activity] ${isActive ? 'on' : 'off'} ${message}`, {
        isActive,
        message: message ?? initialState.message,
      });
    },
  }))
);
