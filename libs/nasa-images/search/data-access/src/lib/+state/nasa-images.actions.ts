import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { NasaImage, NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';

export const nasaImagesPageActions = createActionGroup({
  source: 'NasaImages/Page',
  events: {
    Load: props<{ params: NasaImagesSearchApiParams }>(),
    'Clean Up': emptyProps(),
  },
});

export const nasaImagesAPIActions = createActionGroup({
  source: 'NasaImages/API',
  events: {
    'Load Success': props<{ items: NasaImage[]; count: number }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
