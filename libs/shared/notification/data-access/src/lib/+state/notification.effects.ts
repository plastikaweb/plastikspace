import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { notificationActions } from './notification.actions';
import { selectConfiguration, selectPreserveOnRouteRequest } from './notification.feature';

@Injectable()
export class NotificationEffects {
  readonly #actions$ = inject(Actions);
  readonly #store = inject(Store);

  dismissNotification$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ROUTER_REQUEST),
      concatLatestFrom(() => [
        this.#store.select(selectConfiguration),
        this.#store.select(selectPreserveOnRouteRequest),
      ]),
      filter(([, conf, preserve]) => !!conf && !preserve),
      map(() => notificationActions.dismiss())
    );
  });
}
