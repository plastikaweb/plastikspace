import { ErrorHandler, inject, Injectable, Injector, NgZone } from '@angular/core';

import { notificationStore } from '../+state/notification.store';
import { NotificationConfigService } from './notification-config.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  private readonly notificationService = inject(NotificationConfigService);
  private readonly injector = inject(Injector);
  private readonly zone = inject(NgZone);

  constructor() {
    window.addEventListener('error', event => {
      this.zone.run(() => this.handleError(event.error));
      event.preventDefault();
    });

    window.addEventListener('unhandledrejection', event => {
      this.zone.run(() => this.handleError(event.reason));
      event.preventDefault();
    });
  }

  handleError(error: ErrorEvent | Error | string): void {
    const store = this.injector.get(notificationStore);

    if (error instanceof ErrorEvent || error instanceof Error) {
      const message = error?.message.includes('ChunkLoadError')
        ? error.message.split('.')[0]
        : error.message;

      store.show(
        this.notificationService.getInstance({
          type: 'ERROR',
          message,
          action: 'tancar',
        })
      );
    } else {
      store.show(
        this.notificationService.getInstance({
          type: 'ERROR',
          message: error,
          action: 'tancar',
        })
      );
    }
  }
}
