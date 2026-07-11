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

  // `options` precedes `parameters` because most callers set behaviour (e.g. groupKey) but only a
  // few pass translation/render parameters, so this keeps the common call sites free of `undefined`.
  create(
    message: string,
    type: NotificationType,
    options?: { preserve?: boolean; groupKey?: string; duration?: number },
    parameters?: Record<string, unknown>
  ): void {
    this.#notificationStore.show(
      this.#notificationService.getInstance({
        message,
        type,
        parameters,
        groupKey: options?.groupKey,
        // Only forward duration when provided; passing undefined would clobber the per-type default.
        ...(options?.duration != null ? { duration: options.duration } : {}),
      }),
      { preserveOnRouteRequest: options?.preserve ?? true }
    );
    this.#liveAnnouncer.announce(message, 'assertive', 1000);
  }
}
