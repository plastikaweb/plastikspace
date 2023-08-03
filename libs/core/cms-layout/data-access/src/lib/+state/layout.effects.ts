import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';

import { layoutActions } from './layout.actions';
import { selectIsMobile, selectSidenavOpened } from './layout.feature';
@Injectable()
export class LayoutEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  routerRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      concatLatestFrom(() => [this.store.select(selectSidenavOpened), this.store.select(selectIsMobile)]),
      filter(([, sideBarVisibility, isMobile]) => sideBarVisibility && isMobile),
      map(() => layoutActions.toggleSidenav({ opened: false })),
    );
  });
}
