import { inject, Injectable } from '@angular/core';
import { Notification, NOTIFICATION_TYPES_CONFIG } from '@plastik/shared/notification/entities';

@Injectable({
  providedIn: 'root',
})
export class NotificationConfigService {
  #notification: Notification | null = null;
  readonly #notificationTypesConfig = inject(NOTIFICATION_TYPES_CONFIG);

  private removeInstance(): void {
    this.#notification = null;
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
    this.removeInstance();

    this.#notification = {
      ...this.#notificationTypesConfig[type],
      ...extras,
      type,
      message,
    };
    return this.#notification;
  }
}
