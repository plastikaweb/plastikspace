import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { NasaImagesEffects, nasaMediaReducer, NASA_IMAGES_FEATURE_KEY } from '@plastik/nasa-images/data-access';
import { NasaImagesViews } from '@plastik/nasa-images/entities';

import { NasaImagesFeatureSearchRouterTitleService } from './nasa-images-feature-search-route-title.service';
import { NasaImagesFeatureSearchComponent } from './nasa-images-feature-search/nasa-images-feature-search.component';

export const nasaImagesFeatureSearchRoutes: Routes = [
  {
    path: '',
    data: { name: NasaImagesViews.SEARCH },
    title: NasaImagesFeatureSearchRouterTitleService,
    component: NasaImagesFeatureSearchComponent,
    providers: [provideState(NASA_IMAGES_FEATURE_KEY, nasaMediaReducer), provideEffects(NasaImagesEffects)],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];
