import { MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  NasaImagesEffects,
  NasaImagesSearchFacade,
  selectNasaImagesFeature,
} from '@plastik/nasa-images/search/data-access';

import { NasaImagesSearchSearchRouterTitleService } from './nasa-images-search-feature-route-title.service';
import { NasaImagesSearchFeatureComponent } from './nasa-images-search-feature/nasa-images-search-feature.component';

export const nasaImagesSearchFeatureRoutes: Routes = [
  {
    path: '',
    data: { name: 'search' },
    title: NasaImagesSearchSearchRouterTitleService,
    component: NasaImagesSearchFeatureComponent,
    providers: [
      provideState(selectNasaImagesFeature),
      provideEffects(NasaImagesEffects),
      NasaImagesSearchFacade,
      {
        provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
        useValue: {
          pageSize: 100,
          pageSizeOptions: [100],
          hidePageSize: true,
          showFirstLastButtons: true,
        },
      },
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];
