import { tap } from 'rxjs';

/* eslint-disable ngrx/no-dispatch-in-effects */
import { Location } from '@angular/common';
import { inject, Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

import { NavigationService } from '../../services/navigation.service';
import { routerActions } from '../actions/router-state.actions';

@Injectable()
export class RouterStateEffects {
  readonly #actions$ = inject(Actions);
  readonly #location = inject(Location);
  readonly #navigationService = inject(NavigationService);
  readonly #zone = inject(NgZone);

  navigate$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(routerActions.go),
        tap(action => this.#navigationService.navigate(action))
      );
    },
    { dispatch: false }
  );

  navigateBack$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(routerActions.back),
        tap(({ url, regex }) => this.#navigationService.back(url, regex))
      );
    },
    { dispatch: false }
  );

  navigateForward$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(routerActions.forward),
        tap(() => this.#location.forward())
      );
    },
    { dispatch: false }
  );

  scrollToTop$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        tap(() => {
          this.#zone.runOutsideAngular(() => {
            const mainElement = document.getElementById('mainContent');
            mainElement?.scrollTo(0, 0);
          });
        })
      );
    },
    { dispatch: false }
  );
}
