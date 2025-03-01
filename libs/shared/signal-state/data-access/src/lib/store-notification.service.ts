import { inject, Injectable } from '@angular/core';
import {
  NotificationConfigService,
  notificationStore,
} from '@plastik/shared/notification/data-access';
import { NotificationType } from '@plastik/shared/notification/entities';

@Injectable({ providedIn: 'root' })
export class StoreNotificationService {
  readonly #notificationService = inject(NotificationConfigService);
  readonly #notificationStore = inject(notificationStore);

  create(message: string, type: NotificationType, preserve = true): void {
    this.#notificationStore.show(
      this.#notificationService.getInstance({ message, type }),
      preserve
    );
  }
}
