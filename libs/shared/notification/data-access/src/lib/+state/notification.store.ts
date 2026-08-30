import {
  updateState,
  withDevtools,
  withDevToolsStub,
  withImmutableState,
} from '@angular-architects/ngrx-toolkit';
import { inject, isDevMode } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { Notification, NOTIFICATION_MAX_CONCURRENT } from '@plastik/shared/notification/entities';

export interface NotificationState {
  configuration: Notification[];
  preserveOnRouteRequest: boolean;
}

const initialState: NotificationState = {
  configuration: [],
  preserveOnRouteRequest: false,
};

export const notificationStore = signalStore(
  { providedIn: 'root' },
  isDevMode() ? withDevtools('notification') : withDevToolsStub('notification'),
  withImmutableState<NotificationState>(initialState),
  withMethods(store => {
    const maxConcurrent = inject(NOTIFICATION_MAX_CONCURRENT);
    let seq = 0;

    return {
      show: (notification: Notification, options?: { preserveOnRouteRequest?: boolean }) => {
        const current = store.configuration();
        const { groupKey } = notification;
        const existingIndex = groupKey ? current.findIndex(item => item.groupKey === groupKey) : -1;

        let configuration: Notification[];

        // Refresh in place only when the grouped notification is already the newest AND keeps the
        // same type — a same-type refresh just swaps the rendered content, so the toast's
        // type-driven styling/duration stay correct. A type change (e.g. SUCCESS → ERROR for the
        // same groupKey) must restack with a fresh id so the UI re-shows it with the right styling.
        if (
          existingIndex !== -1 &&
          existingIndex === current.length - 1 &&
          current[existingIndex].type === notification.type
        ) {
          const next: Notification = { ...notification, id: current[existingIndex].id };

          configuration = current.map((item, i) => (i === existingIndex ? next : item));
        } else {
          // New notification, an older grouped one, or a type change: assign a fresh id, drop any
          // prior entry sharing its groupKey, and append so the latest update sits on top of the
          // stack (its new id makes the UI re-show it as the most recent toast).
          const next: Notification = { ...notification, id: `#${++seq}` };
          const base = groupKey ? current.filter(item => item.groupKey !== groupKey) : current;

          configuration = [...base, next];

          // Cap retained notifications, dropping the oldest beyond the configured maximum.
          if (configuration.length > maxConcurrent) {
            configuration = configuration.slice(-maxConcurrent);
          }
        }

        updateState(store, `[notification] show`, {
          configuration,
          preserveOnRouteRequest: options?.preserveOnRouteRequest ?? false,
        });
      },
      dismiss: (id?: string) => {
        // No id clears everything (back-compat for the mat-snackbar dismiss-all path).
        if (id == null) {
          updateState(store, `[notification] dismiss`, initialState);

          return;
        }

        updateState(store, `[notification] dismiss ${id}`, state => ({
          ...state,
          configuration: state.configuration.filter(item => item.id !== id),
        }));
      },
    };
  })
);
