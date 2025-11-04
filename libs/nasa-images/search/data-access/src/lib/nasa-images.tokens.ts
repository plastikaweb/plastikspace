import { Provider } from '@angular/core';
import { createDataGetListServiceToken } from '@plastik/core/api';
import { NasaImagesSearch, NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { NasaImagesApiService } from './nasa-images-api.service';

export const NASA_IMAGES_DATA_LIST_TOKEN = createDataGetListServiceToken<
  NasaImagesSearch,
  NasaImagesSearchApiParams
>('NASA_IMAGES_DATA_LIST_TOKEN');

export const NASA_IMAGES_PROVIDERS: Provider[] = [
  { provide: NASA_IMAGES_DATA_LIST_TOKEN, useExisting: NasaImagesApiService },
];
