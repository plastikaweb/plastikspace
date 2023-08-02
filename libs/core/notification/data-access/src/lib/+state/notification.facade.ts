import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { notificationActions } from './notification.actions';
import { selectConfiguration } from './notification.feature';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  private readonly store = inject(Store);

  config$ = this.store.select(selectConfiguration);

  dismiss(): void {
    this.store.dispatch(notificationActions.dismiss());
  }
}
