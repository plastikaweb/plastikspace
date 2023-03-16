import { Location } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { tap } from 'rxjs/operators';

import { NavigationService } from '../../services/navigation.service';
import { back, forward, go } from '../actions/router-state.actions';

@Injectable()
export class RouterStateEffects {
  navigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(go),
        tap(action => this.navigationService.navigate(action)),
      );
    },
    { dispatch: false },
  );

  navigateBack$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(back),
        tap(({ url, regex }) => this.navigationService.back(url, regex)),
      );
    },
    { dispatch: false },
  );

  navigateForward$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(forward),
        tap(() => this.location.forward()),
      );
    },
    { dispatch: false },
  );

  scrollToTop$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        tap(() => {
          this.zone.runOutsideAngular(() => {
            const mainElement = document.getElementById('mainContent')?.parentElement;
            mainElement?.scrollTo(0, 0);
          });
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly location: Location,
    private readonly navigationService: NavigationService,
    private readonly zone: NgZone,
  ) {}
}
