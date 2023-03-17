import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NavigationFilterService, selectRouteQueryParams } from '@plastik/core/router-state';
import { catchError, exhaustMap, filter, map, of } from 'rxjs';

import { NasaImagesSearchApiError, NasaImagesSearchApiParams, NasaImagesViews } from '@plastik/nasa-images/entities';
import { selectActivityActive, setActivity } from '@plastik/shared/activity/data-access';
import { NasaImagesApiService } from '../nasa-images-api.service';
import * as NasaImagesActions from './nasa-images.actions';
import { loadNasaImages } from './nasa-images.actions';

@Injectable()
export class NasaImagesEffects {
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(NasaImagesApiService);
  private readonly navigationFilter = inject(NavigationFilterService);
  private readonly store = inject(Store);

  navigation$ = createEffect(() => {
    return this.actions$.pipe(
      this.navigationFilter.checkRouterNavigation<NasaImagesViews>(NasaImagesViews.SEARCH),
      concatLatestFrom(() => [this.store.select(selectRouteQueryParams), this.store.select(selectActivityActive)]),
      filter(([, , activity]) => !activity),
      map(([, queryParams]) => loadNasaImages({ params: { ...(queryParams as NasaImagesSearchApiParams), ...{ media_type: 'image' } } })),
    );
  });

  activeOn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NasaImagesActions.loadNasaImages),
      map(() => setActivity({ active: true })),
    );
  });

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NasaImagesActions.loadNasaImages),
      exhaustMap(({ params }) =>
        this.apiService.getList(params).pipe(
          map(({ items, count }) => NasaImagesActions.loadNasaImagesSuccess({ items, count })),
          catchError((error: NasaImagesSearchApiError) => of(NasaImagesActions.loadNasaImagesFailure({ error: error?.reason || 'error' }))),
        ),
      ),
    );
  });

  activeOff$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NasaImagesActions.loadNasaImagesSuccess, NasaImagesActions.loadNasaImagesFailure),
      map(() => setActivity({ active: false })),
    );
  });
}
