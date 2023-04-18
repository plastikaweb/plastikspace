import { Inject, Injectable } from '@angular/core';

import { NOTIFICATION_TYPES_CONFIG, Notification, NotificationType, NotificationTypesConfig } from '@plastik/core/notification/entities';

@Injectable({
  providedIn: 'root',
})
export class NotificationConfigService {
  constructor(@Inject(NOTIFICATION_TYPES_CONFIG) private readonly notificationTypesConfig: NotificationTypesConfig) {}
  /**
   * @description returns a valid configuration of object for ui messages
   * it returns an angular material Snackbar MatSnackBarConfig class configuration.
   * @param { Partial<Notification> } notification The control configuration to format the object property value.
   * @param  { NotificationType } notification.type The type of notification.
   * @param  { string } notification.message The content of the message to notify.
   * @returns { Notification } A notification object.
   */
  getInstance({ type = NotificationType.Error, message = '', ...extras }: Partial<Notification> = {}): Notification {
    return {
      ...this.notificationTypesConfig[type],
      ...extras,
      type,
      message,
    };
  }
}
