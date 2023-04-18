import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { dismissNotification } from './notification.actions';
import { selectNotificationConfiguration } from './notification.selectors';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  private readonly store = inject(Store);

  config$ = this.store.select(selectNotificationConfiguration);

  dismiss(): void {
    this.store.dispatch(dismissNotification());
  }
}
