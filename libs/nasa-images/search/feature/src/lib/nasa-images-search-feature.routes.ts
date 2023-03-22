import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { NasaImagesEffects, NasaImagesFacade, nasaMediaReducer, NASA_IMAGES_FEATURE_KEY } from '@plastik/nasa-images/search/data-access';
import { NasaImagesViews } from '@plastik/nasa-images/search/entities';

import { NasaImagesSearchSearchRouterTitleService } from './nasa-images-search-feature-route-title.service';
import { NasaImagesSearchFeatureComponent } from './nasa-images-search-feature/nasa-images-search-feature.component';

export const nasaImagesSearchFeatureRoutes: Routes = [
  {
    path: '',
    data: { name: NasaImagesViews.SEARCH },
    title: NasaImagesSearchSearchRouterTitleService,
    component: NasaImagesSearchFeatureComponent,
    providers: [provideState(NASA_IMAGES_FEATURE_KEY, nasaMediaReducer), provideEffects(NasaImagesEffects), NasaImagesFacade],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];
