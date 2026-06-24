import { InjectionToken, Provider } from '@angular/core';

import { Notification, NotificationTypesConfig } from './notification';

const defaultNotification: NotificationTypesConfig = {
  ['ERROR']: {
    type: 'ERROR',
    icon: 'error',
    action: 'close',
    duration: 5000,
  },
  ['WARNING']: {
    type: 'WARNING',
    icon: 'warning',
    duration: 5000,
  },
  ['INFO']: {
    type: 'INFO',
    icon: 'info',
    duration: 3000,
  },
  ['SUCCESS']: {
    type: 'SUCCESS',
    icon: 'check',
    action: 'close',
    duration: 2000,
  },
};

/** Injection token with notification configuration dictionary depending on its type. */
export const NOTIFICATION_TYPES_CONFIG = new InjectionToken<NotificationTypesConfig>(
  'notification',
  {
    providedIn: 'root',
    factory: () => defaultNotification,
  }
);

/** Injection token with notification position. */
export const NOTIFICATION_POSITION = new InjectionToken<
  Pick<Notification, 'verticalPosition' | 'horizontalPosition'>
>('notificationPosition', {
  providedIn: 'root',
  factory: () => ({
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
  }),
});

/** Default maximum number of notifications retained in the store and shown in the UI at once. */
const DEFAULT_NOTIFICATION_MAX_CONCURRENT = 3;

/**
 * Injection token with the maximum number of concurrent notifications. It bounds the store array
 * (oldest dropped beyond it) and, for the hot-toast UI, drives the library's visible-toast cap.
 * The mat-snackbar UI shows one at a time, so for it this only bounds retained state.
 */
export const NOTIFICATION_MAX_CONCURRENT = new InjectionToken<number>('notificationMaxConcurrent', {
  providedIn: 'root',
  factory: () => DEFAULT_NOTIFICATION_MAX_CONCURRENT,
});

/**
 * Configuration accepted by `provideNotificationConfig`. Every field is optional; omitted fields
 * keep their root defaults.
 */
export interface NotificationConfig {
  /** Per-type defaults (duration, icon, action) keyed by notification type. */
  types?: NotificationTypesConfig;
  /** Screen placement applied to every notification. */
  position?: Pick<Notification, 'verticalPosition' | 'horizontalPosition'>;
  /** Maximum number of concurrent notifications (store cap and hot-toast visible cap). */
  maxConcurrent?: number;
}

/**
 * Provides notification behaviour overrides for every notification UI from a single place.
 * @param { NotificationConfig } config The per-type durations, position and max-concurrent overrides.
 * @returns { Provider[] } The providers wiring the supplied overrides onto the notification tokens.
 */
export function provideNotificationConfig(config: NotificationConfig = {}): Provider[] {
  const providers: Provider[] = [];

  if (config.types) {
    providers.push({ provide: NOTIFICATION_TYPES_CONFIG, useValue: config.types });
  }
  if (config.position) {
    providers.push({ provide: NOTIFICATION_POSITION, useValue: config.position });
  }
  if (config.maxConcurrent != null) {
    providers.push({ provide: NOTIFICATION_MAX_CONCURRENT, useValue: config.maxConcurrent });
  }

  return providers;
}
