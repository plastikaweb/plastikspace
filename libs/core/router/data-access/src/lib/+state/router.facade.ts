import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  selectRouteDataName,
  selectRouteQueryParams,
  selectRouteUrl,
} from './selectors/router-state.selectors';

@Injectable({
  providedIn: 'root',
})
export class RouterFacade {
  protected readonly store = inject(Store);

  routeName$ = this.store.select(selectRouteDataName);
  routeUrl$ = this.store.select(selectRouteUrl);
  routeQueryParams$ = this.store.select(selectRouteQueryParams);
}
