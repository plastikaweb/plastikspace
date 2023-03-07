import { Routes } from '@angular/router';
import { NasaImagesViews } from '@plastik/nasa-images/entities';

import { NasaImagesFeatureSearchComponent } from './nasa-images-feature-search/nasa-images-feature-search.component';

export const nasaImagesFeatureSearchRoutes: Routes = [
  { path: '', data: { name: NasaImagesViews.SEARCH }, component: NasaImagesFeatureSearchComponent },
];
