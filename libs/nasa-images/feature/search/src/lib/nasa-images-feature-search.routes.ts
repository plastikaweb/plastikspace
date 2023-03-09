import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { NASA_IMAGES_FEATURE_KEY, NasaImagesEffects, nasaMediaReducer } from '@plastik/nasa-images/data-access';
import { NasaImagesViews } from '@plastik/nasa-images/entities';

import { NasaImagesFeatureSearchComponent } from './nasa-images-feature-search/nasa-images-feature-search.component';

export const nasaImagesFeatureSearchRoutes: Routes = [
  {
    path: '',
    data: { name: NasaImagesViews.SEARCH },
    component: NasaImagesFeatureSearchComponent,
    providers: [provideState(NASA_IMAGES_FEATURE_KEY, nasaMediaReducer), provideEffects(NasaImagesEffects)],
  },
];
