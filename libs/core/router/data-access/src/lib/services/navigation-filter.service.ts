import { EMPTY, Observable, pipe, UnaryFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import {
  ROUTER_NAVIGATION,
  RouterNavigationAction,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';

import { selectRouteDataName } from '../+state/selectors/router-state.selectors';

@Injectable({
  providedIn: 'root',
})
export class NavigationFilterService {
  constructor(protected readonly store: Store) {}

  /**
   * @description Checks if the selected view matches the route on ROUTER_NAVIGATION.
   * @param {string} view The current view/route name.
   * @returns {UnaryFunction<Observable<Action>, Observable<[RouterNavigationAction<SerializedRouterStateSnapshot>, unknown]>>}.
   */
  checkRouterNavigation<T = 'string'>(
    view: T
  ): UnaryFunction<Observable<Action<string>>, Observable<Observable<never>>> {
    return pipe(
      ofType<RouterNavigationAction>(ROUTER_NAVIGATION),
      concatLatestFrom(() => this.store.select(selectRouteDataName)),
      filter(([, name]) => name === view),
      map(() => EMPTY)
    );
  }
}
