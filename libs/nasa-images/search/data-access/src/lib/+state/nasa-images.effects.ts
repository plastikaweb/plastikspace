import { catchError, exhaustMap, map, of, tap } from 'rxjs';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { NavigationFilterService, selectRouteQueryParams } from '@plastik/core/router-state';
import {
  NasaImagesSearchApiError,
  NasaImagesSearchApiParams,
  NasaImagesViews,
} from '@plastik/nasa-images/search/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import {
  NotificationConfigService,
  notificationStore,
} from '@plastik/shared/notification/data-access';

import { NasaImagesApiService } from '../nasa-images-api.service';
import { nasaImagesAPIActions, nasaImagesPageActions } from './nasa-images.actions';

@Injectable()
export class NasaImagesEffects {
  readonly #actions$ = inject(Actions);
  readonly #apiService = inject(NasaImagesApiService);
  readonly #navigationFilter = inject(NavigationFilterService);
  readonly #notificationService = inject(NotificationConfigService);
  readonly #store = inject(Store);
  readonly #activityStore = inject(activityStore);
  readonly #notificationStore = inject(notificationStore);
  readonly #liveAnnouncer = inject(LiveAnnouncer);

  navigation$ = createEffect(() => {
    return this.#actions$.pipe(
      this.#navigationFilter.checkRouterNavigation<NasaImagesViews>('search'),
      concatLatestFrom(() => [this.#store.select(selectRouteQueryParams)]),
      map(([, queryParams]) => {
        if (!queryParams['q']) {
          return nasaImagesPageActions.cleanUp();
        }
        return nasaImagesPageActions.load({
          params: { ...(queryParams as NasaImagesSearchApiParams), ...{ media_type: 'image' } },
        });
      })
    );
  });

  activeOn$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(nasaImagesPageActions.load),
        map(() => this.#activityStore.setActivity(true))
      );
    },
    { dispatch: false }
  );

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(nasaImagesPageActions.load),
      tap(({ params }) =>
        this.#liveAnnouncer.announce(`searching for ${params.q}`, 'assertive', 5000)
      ),
      exhaustMap(({ params }) =>
        this.#apiService.getList(params).pipe(
          map(({ items, count }) => nasaImagesAPIActions.loadSuccess({ items, count })),
          catchError((error: NasaImagesSearchApiError) =>
            of(nasaImagesAPIActions.loadFailure({ error: error?.reason }))
          )
        )
      )
    );
  });

  loadSuccess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(nasaImagesAPIActions.loadSuccess),
        tap(() => this.#liveAnnouncer.announce('Search completed successfully', 'assertive', 5000))
      );
    },
    { dispatch: false }
  );

  activeOff$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(nasaImagesAPIActions.loadSuccess, nasaImagesAPIActions.loadFailure),
        map(() => this.#activityStore.setActivity(false))
      );
    },
    { dispatch: false }
  );

  showNotification$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(nasaImagesAPIActions.loadFailure),
        map(({ error }) => {
          const message = error || 'The request has failed. Please try it again.';
          this.#liveAnnouncer.announce(message, 'assertive', 5000);
          this.#notificationStore.show(
            this.#notificationService.getInstance({
              type: 'ERROR',
              message,
            })
          );
        })
      );
    },
    { dispatch: false }
  );
}
