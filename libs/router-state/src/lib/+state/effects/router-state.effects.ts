import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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

  constructor(
    private readonly actions$: Actions,
    private readonly location: Location,
    private readonly navigationService: NavigationService,
  ) {}
}
