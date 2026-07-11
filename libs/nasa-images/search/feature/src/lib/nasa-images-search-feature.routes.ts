import { MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  NasaImagesEffects,
  NasaImagesSearchFacade,
  NASA_IMAGES_PROVIDERS,
  selectNasaImagesFeature,
} from '@plastik/nasa-images/search/data-access';
import { provideFormlyConfig } from '@plastik/shared/form';

import { NasaImagesSearchSearchRouterTitleService } from './nasa-images-search-feature-route-title.service';
import { NasaImagesSearchFeatureComponent } from './nasa-images-search-feature/nasa-images-search-feature.component';

export const nasaImagesSearchFeatureRoutes: Routes = [
  {
    path: '',
    data: { name: 'search' },
    title: NasaImagesSearchSearchRouterTitleService,
    component: NasaImagesSearchFeatureComponent,
    providers: [
      provideFormlyConfig(),
      provideState(selectNasaImagesFeature),
      provideEffects(NasaImagesEffects),
      ...NASA_IMAGES_PROVIDERS,
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
