import { ErrorHandler, inject, Injectable, Injector } from '@angular/core';

import { notificationStore } from '../+state/notification.store';
import { NotificationConfigService } from './notification-config.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  private readonly notificationService = inject(NotificationConfigService);
  private readonly injector = inject(Injector);

  handleError(error: ErrorEvent | Error | string): void {
    const store = this.injector.get(notificationStore);
    let message = '';

    if (error instanceof ErrorEvent || error instanceof Error) {
      message = error?.message.includes('ChunkLoadError')
        ? error.message.split('.')[0]
        : error.message;
    } else {
      message = error;
    }

    store.show(
      this.notificationService.getInstance({
        type: 'ERROR',
        message,
        action: 'tancar',
      })
    );
  }
}
