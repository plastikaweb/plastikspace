import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { NasaImagesApiService } from '../nasa-images-api.service';
import * as NasaImagesActions from './nasa-images.actions';

@Injectable()
export class NasaImagesEffects {
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(NasaImagesApiService);

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NasaImagesActions.loadNasaImages),
      exhaustMap(({ params }) =>
        this.apiService.getList(params).pipe(
          map(({ items, count }) => NasaImagesActions.loadNasaImagesSuccess({ items, count })),
          catchError(error => of(NasaImagesActions.loadNasaImagesFailure({ error }))),
        ),
      ),
    );
  });
}
