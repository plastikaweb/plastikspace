import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NavigationFilterService, selectRouteQueryParams } from '@plastik/core/router-state';
import { catchError, exhaustMap, filter, map, of, tap } from 'rxjs';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NotificationConfigService, showNotification } from '@plastik/core/notification/data-access';
import { NasaImagesSearchApiError, NasaImagesSearchApiParams, NasaImagesViews } from '@plastik/nasa-images/search/entities';
import { selectActivityActive, setActivity } from '@plastik/shared/activity/data-access';
import { NasaImagesApiService } from '../nasa-images-api.service';
import * as NasaImagesActions from './nasa-images.actions';
import { loadNasaImages } from './nasa-images.actions';

@Injectable()
export class NasaImagesEffects {
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(NasaImagesApiService);
  private readonly navigationFilter = inject(NavigationFilterService);
  private readonly notificationService = inject(NotificationConfigService);
  private readonly store = inject(Store);
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  navigation$ = createEffect(() => {
    return this.actions$.pipe(
      this.navigationFilter.checkRouterNavigation<NasaImagesViews>('SEARCH'),
      concatLatestFrom(() => [this.store.select(selectRouteQueryParams), this.store.select(selectActivityActive)]),
      filter(([, , activity]) => !activity),
      map(([, queryParams]) => {
        if (!queryParams['q']) {
          return NasaImagesActions.cleanupNasaImages();
        }
        return loadNasaImages({ params: { ...(queryParams as NasaImagesSearchApiParams), ...{ media_type: 'image' } } });
      }),
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
      tap(({ params }) => this.liveAnnouncer.announce(`searching for ${params.q}`, 'assertive', 5000)),
      exhaustMap(({ params }) =>
        this.apiService.getList(params).pipe(
          map(({ items, count }) => NasaImagesActions.loadNasaImagesSuccess({ items, count })),
          catchError((error: NasaImagesSearchApiError) => of(NasaImagesActions.loadNasaImagesFailure({ error: error?.reason }))),
        ),
      ),
    );
  });

  loadSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NasaImagesActions.loadNasaImagesSuccess),
        tap(() => this.liveAnnouncer.announce('Search completed successfully', 'assertive', 5000)),
      );
    },
    { dispatch: false },
  );

  activeOff$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NasaImagesActions.loadNasaImagesSuccess, NasaImagesActions.loadNasaImagesFailure),
      map(() => setActivity({ active: false })),
    );
  });

  showNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NasaImagesActions.loadNasaImagesFailure),
      map(({ error }) => {
        const message = error || 'The request has failed. Please try it again.';
        this.liveAnnouncer.announce(message, 'assertive', 5000);
        return showNotification({
          configuration: this.notificationService.getInstance({
            type: 'ERROR',
            message: `<span class="sr-only">Error: </span>${message}`,
          }),
        });
      }),
    );
  });
}
