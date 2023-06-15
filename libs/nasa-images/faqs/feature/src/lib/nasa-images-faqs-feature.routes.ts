import { Routes } from '@angular/router';

import { NasaImagesFaqsFeatureComponent } from './nasa-images-faqs-feature/nasa-images-faqs-feature.component';
import { NasaImagesFaqsService } from './nasa-images-faqs.service';

export const nasaImagesFaqsFeatureRoutes: Routes = [
  {
    path: '',
    data: { name: 'faqs' },
    title: 'FAQs',
    component: NasaImagesFaqsFeatureComponent,
    providers: [NasaImagesFaqsService],
  },
];
