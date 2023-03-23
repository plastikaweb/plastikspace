import { createAction, props } from '@ngrx/store';
import { NasaImage, NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';

export const loadNasaImages = createAction('[NasaImages] Load', props<{ params: NasaImagesSearchApiParams }>());

export const loadNasaImagesSuccess = createAction('[NasaImages/API] Load Success', props<{ items: NasaImage[]; count: number }>());

export const loadNasaImagesFailure = createAction('[NasaImages/API] Load Failure', props<{ error: string }>());

export const cleanupNasaImages = createAction('[NasaImages] Clean Up');
