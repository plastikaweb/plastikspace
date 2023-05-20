import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  NASA_IMAGES_FEATURE_KEY,
  NasaImagesEffects,
  NasaImagesSearchFacade,
  nasaMediaReducer,
} from '@plastik/nasa-images/search/data-access';

import { NasaImagesSearchSearchRouterTitleService } from './nasa-images-search-feature-route-title.service';
import { NasaImagesSearchFeatureComponent } from './nasa-images-search-feature/nasa-images-search-feature.component';

export const nasaImagesSearchFeatureRoutes: Routes = [
  {
    path: '',
    data: { name: 'SEARCH' },
    title: NasaImagesSearchSearchRouterTitleService,
    component: NasaImagesSearchFeatureComponent,
    providers: [provideState(NASA_IMAGES_FEATURE_KEY, nasaMediaReducer), provideEffects(NasaImagesEffects), NasaImagesSearchFacade],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];
