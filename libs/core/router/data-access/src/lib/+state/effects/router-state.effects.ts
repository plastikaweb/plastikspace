/* eslint-disable ngrx/no-dispatch-in-effects */
import { Location } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ROUTER_CANCEL,
  ROUTER_ERROR,
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
} from '@ngrx/router-store';
import { tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { activityActions } from '@plastik/shared/activity/data-access';
import { NavigationService } from '../../services/navigation.service';
import { routerActions } from '../actions/router-state.actions';

@Injectable()
export class RouterStateEffects {
  navigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerActions.go),
        tap(action => this.navigationService.navigate(action))
      );
    },
    { dispatch: false }
  );

  navigateBack$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerActions.back),
        tap(({ url, regex }) => this.navigationService.back(url, regex))
      );
    },
    { dispatch: false }
  );

  navigateForward$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerActions.forward),
        tap(() => this.location.forward())
      );
    },
    { dispatch: false }
  );

  scrollToTop$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        tap(() => {
          this.zone.runOutsideAngular(() => {
            const mainElement = document.getElementById('mainContent');
            mainElement?.scrollTo(0, 0);
          });
        })
      );
    },
    { dispatch: false }
  );

  setActivityOnNavigation$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        tap(() => this.store.dispatch(activityActions.setActivity({ isActive: true })))
      );
    },
    { dispatch: false }
  );

  setActivityOffNavigation$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATED, ROUTER_CANCEL, ROUTER_ERROR),
        tap(() => this.store.dispatch(activityActions.setActivity({ isActive: false })))
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly location: Location,
    private readonly navigationService: NavigationService,
    private readonly zone: NgZone,
    private readonly store: Store
  ) {}
}
