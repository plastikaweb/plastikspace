import { Location } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ROUTER_CANCEL,
  ROUTER_ERROR,
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  ROUTER_REQUEST,
  RouterRequestPayload,
} from '@ngrx/router-store';
import { map, tap } from 'rxjs';

import { activityActions } from '@plastik/shared/activity/data-access';
import { NavigationService } from '../../services/navigation.service';
import { routerActions } from '../actions/router-state.actions';
import { RouterStateUrl } from '../reducer/router-state.reducer';

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

  setActivityOnNavigation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_REQUEST),
      map(({ payload }) => {
        const queryParams = (payload as RouterRequestPayload<RouterStateUrl>).routerState
          ?.queryParams;
        if (!queryParams?.['noActivity']) {
          return activityActions.setActivity({ isActive: true });
        }
        return { type: '[Router] No Activity' };
      })
    );
  });

  setActivityOffNavigation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED, ROUTER_CANCEL, ROUTER_ERROR),
      map(() => activityActions.setActivity({ isActive: false }))
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly location: Location,
    private readonly navigationService: NavigationService,
    private readonly zone: NgZone
  ) {}
}
