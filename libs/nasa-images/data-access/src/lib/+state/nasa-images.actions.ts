import { createAction, props } from '@ngrx/store';
import { NasaImage, NasaImagesSearchApiParams } from '@plastik/nasa-images/entities';

export const loadNasaImages = createAction('[NasaImages Page] Init', props<{ params: NasaImagesSearchApiParams }>());

export const loadNasaImagesSuccess = createAction(
  '[NasaImages/API] Load NasaImages Success',
  props<{ items: NasaImage[]; count: number }>(),
);

export const loadNasaImagesFailure = createAction('[NasaImages/API] Load NasaImages Failure', props<{ error: string }>());
