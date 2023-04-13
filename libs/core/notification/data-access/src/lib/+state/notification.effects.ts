import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { hideNotification } from './notification.actions';
import { selectNotificationPreserveOnRouteRequest } from './notification.selectors';

@Injectable()
export class NotificationEffects {
  hideNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_REQUEST),
      concatLatestFrom(() => this.store.select(selectNotificationPreserveOnRouteRequest)),
      filter(([, preserve]) => !preserve),
      map(() => hideNotification()),
    );
  });

  constructor(private readonly actions$: Actions, private readonly store: Store) {}
}
