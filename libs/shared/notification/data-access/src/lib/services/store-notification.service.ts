import { LiveAnnouncer } from '@angular/cdk/a11y';
import { inject, Injectable } from '@angular/core';
import { NotificationType } from '@plastik/shared/notification/entities';
import { notificationStore } from '../+state/notification.store';
import { NotificationConfigService } from './notification-config.service';

@Injectable({ providedIn: 'root' })
export class StoreNotificationService {
  readonly #notificationService = inject(NotificationConfigService);
  readonly #notificationStore = inject(notificationStore);
  readonly #liveAnnouncer = inject(LiveAnnouncer);

  create(
    message: string,
    type: NotificationType,
    parameters?: Record<string, unknown>,
    preserve = true
  ): void {
    this.#notificationStore.show(
      this.#notificationService.getInstance({ message, type, parameters }),
      preserve
    );
    this.#liveAnnouncer.announce(message, 'assertive', 1000);
  }
}
