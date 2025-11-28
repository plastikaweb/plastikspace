import { LiveAnnouncer } from '@angular/cdk/a11y';
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
  readonly #liveAnnouncer = inject(LiveAnnouncer);

  create(message: string, type: NotificationType, preserve = true): void {
    this.#notificationStore.show(
      this.#notificationService.getInstance({ message, type }),
      preserve
    );
    this.#liveAnnouncer.announce(message, 'assertive', 1000);
  }
}
