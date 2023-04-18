import { Injectable, inject } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { dismissNotification } from './notification.actions';
import { selectNotificationPreserveOnRouteRequest } from './notification.selectors';

@Injectable()
export class NotificationEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  dismissNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_REQUEST),
      concatLatestFrom(() => this.store.select(selectNotificationPreserveOnRouteRequest)),
      filter(([, preserve]) => !preserve),
      map(() => dismissNotification()),
    );
  });
}
