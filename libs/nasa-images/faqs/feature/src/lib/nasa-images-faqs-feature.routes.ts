import { Routes } from '@angular/router';
import { NasaImagesViews } from '@plastik/nasa-images/search/entities';

import { NasaImagesFaqsFeatureComponent } from './nasa-images-faqs-feature/nasa-images-faqs-feature.component';
import { NasaImagesFaqsService } from './nasa-images-faqs.service';

export const nasaImagesFaqsFeatureRoutes: Routes = [
  {
    path: '',
    data: { name: NasaImagesViews.FAQS },
    title: 'FAQs',
    component: NasaImagesFaqsFeatureComponent,
    providers: [NasaImagesFaqsService],
  },
];
