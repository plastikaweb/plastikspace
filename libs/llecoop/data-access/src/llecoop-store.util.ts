import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  notificationActions,
  NotificationConfigService,
} from '@plastik/shared/notification/data-access';
import { NotificationType } from '@plastik/shared/notification/entities';

@Injectable({ providedIn: 'root' })
export class StoreNotificationService {
  private readonly notificationService = inject(NotificationConfigService);
  private readonly state = inject(Store);

  create(message: string, type: NotificationType): void {
    this.state.dispatch(
      notificationActions.show({
        configuration: this.notificationService.getInstance({
          type,
          message,
        }),
      })
    );
  }
}
