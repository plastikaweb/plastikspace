import { Inject, Injectable } from '@angular/core';

import {
  NOTIFICATION_TYPES_CONFIG,
  Notification,
  NotificationTypesConfig,
} from '@plastik/shared/notification/entities';

@Injectable({
  providedIn: 'root',
})
export class NotificationConfigService {
  private notification: Notification | null = null;

  constructor(
    @Inject(NOTIFICATION_TYPES_CONFIG)
    private readonly notificationTypesConfig: NotificationTypesConfig
  ) {}

  private removeInstance(): void {
    this.notification = null;
  }

  /**
   * @description Returns a valid configuration of object for ui messages.
   * it returns an angular material Snackbar MatSnackBarConfig class configuration.
   * @param { Partial<Notification> } notification The control configuration to format the object property value.
   * @param  { string } notification.message The content of the message to notify.
   * @returns { Notification } A notification object.
   */
  getInstance({
    type = 'ERROR',
    message = '',
    ...extras
  }: Partial<Notification> = {}): Notification {
    // this.removeInstance();

    this.notification = {
      ...this.notificationTypesConfig[type],
      ...extras,
      type,
      message,
    };
    return this.notification;
  }
}
