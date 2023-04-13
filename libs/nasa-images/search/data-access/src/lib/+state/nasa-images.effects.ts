import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NavigationFilterService, selectRouteQueryParams } from '@plastik/core/router-state';
import { catchError, exhaustMap, filter, map, of } from 'rxjs';

import { NotificationConfigService, showNotification } from '@plastik/core/notification/data-access';
import { NotificationType } from '@plastik/core/notification/entities';
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

  navigation$ = createEffect(() => {
    return this.actions$.pipe(
      this.navigationFilter.checkRouterNavigation<NasaImagesViews>(NasaImagesViews.SEARCH),
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
      exhaustMap(({ params }) =>
        this.apiService.getList(params).pipe(
          map(({ items, count }) => NasaImagesActions.loadNasaImagesSuccess({ items, count })),
          catchError((error: NasaImagesSearchApiError) => of(NasaImagesActions.loadNasaImagesFailure({ error: error?.reason }))),
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

  showNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NasaImagesActions.loadNasaImagesFailure),
      map(({ error }) => {
        const message = error || 'The request has failed. Please try it again.';
        return showNotification({ configuration: this.notificationService.getInstance({ type: NotificationType.Error, message }) });
      }),
    );
  });
}
