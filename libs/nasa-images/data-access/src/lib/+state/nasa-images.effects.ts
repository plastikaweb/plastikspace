import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NavigationFilterService, selectRouteQueryParams } from '@plastik/core/router-state';
import { catchError, exhaustMap, filter, map, of } from 'rxjs';

import { NasaImagesSearchApiError, NasaImagesSearchApiParams, NasaImagesViews } from '@plastik/nasa-images/entities';
import { NasaImagesApiService } from '../nasa-images-api.service';
import * as NasaImagesActions from './nasa-images.actions';
import { loadNasaImages } from './nasa-images.actions';
import { selectNasaImagesLoading } from './nasa-images.selectors';

@Injectable()
export class NasaImagesEffects {
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(NasaImagesApiService);
  private readonly navigationFilter = inject(NavigationFilterService);
  private readonly store = inject(Store);

  navigation$ = createEffect(() => {
    return this.actions$.pipe(
      this.navigationFilter.checkRouterNavigation<NasaImagesViews>(NasaImagesViews.SEARCH),
      concatLatestFrom(() => [this.store.select(selectRouteQueryParams), this.store.select(selectNasaImagesLoading)]),
      filter(([, , loading]) => !loading),
      map(([, queryParams]) => loadNasaImages({ params: { ...(queryParams as NasaImagesSearchApiParams), ...{ media_type: 'image' } } })),
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
}
