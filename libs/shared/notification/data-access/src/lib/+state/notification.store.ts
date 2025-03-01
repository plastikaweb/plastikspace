import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Notification } from '@plastik/shared/notification/entities';

export interface NotificationState {
  configuration: Notification | null;
  preserveOnRouteRequest: boolean;
}

export const notificationStore = signalStore(
  { providedIn: 'root' },
  withDevtools('notification'),
  withState<NotificationState>({
    configuration: null,
    preserveOnRouteRequest: false,
  }),
  withMethods(store => ({
    show: (configuration: Notification, preserveOnRouteRequest?: boolean) => {
      patchState(store, {
        configuration,
        preserveOnRouteRequest: preserveOnRouteRequest ?? false,
      });
    },
    dismiss: () => {
      patchState(store, {
        configuration: null,
        preserveOnRouteRequest: false,
      });
    },
  }))
);
