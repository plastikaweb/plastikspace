import { Injectable } from '@angular/core';
import { concatLatestFrom, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction, SerializedRouterStateSnapshot } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { Observable, pipe, UnaryFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { selectRouteDataName } from '../+state/selectors/router-state.selectors';

@Injectable({
  providedIn: 'root',
})
export class NavigationFilterService {
  constructor(protected readonly store: Store) {}

  /**
   * Checks if the selected view matches the route on ROUTER_NAVIGATION.
   * @param {T} view
   * @returns {UnaryFunction<Observable<Action>, Observable<[RouterNavigationAction<SerializedRouterStateSnapshot>, unknown]>>}
   */
  checkRouterNavigation<T>(
    view: T,
  ): UnaryFunction<Observable<Action>, Observable<[RouterNavigationAction<SerializedRouterStateSnapshot>, unknown]>> {
    return pipe(
      ofType<RouterNavigationAction>(ROUTER_NAVIGATION),
      concatLatestFrom(() => this.store.select(selectRouteDataName)),
      filter(([, name]) => name === view),
    );
  }
}
