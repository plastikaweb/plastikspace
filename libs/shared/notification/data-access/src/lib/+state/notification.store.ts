import {
  updateState,
  withDevtools,
  withDevToolsStub,
  withImmutableState,
} from '@angular-architects/ngrx-toolkit';
import { isDevMode } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { Notification } from '@plastik/shared/notification/entities';

export interface NotificationState {
  configuration: Notification | null;
  preserveOnRouteRequest: boolean;
}

const initialState: NotificationState = {
  configuration: null,
  preserveOnRouteRequest: false,
};

export const notificationStore = signalStore(
  { providedIn: 'root' },
  isDevMode() ? withDevtools('notification') : withDevToolsStub('notification'),
  withImmutableState<NotificationState>(initialState),
  withMethods(store => ({
    show: (configuration: Notification, preserveOnRouteRequest?: boolean) => {
      updateState(store, `[notification] show`, {
        configuration,
        preserveOnRouteRequest: preserveOnRouteRequest ?? false,
      });
    },
    dismiss: () => {
      updateState(store, `[notification] dismiss`, {
        configuration: null,
        preserveOnRouteRequest: false,
      });
    },
  }))
);
