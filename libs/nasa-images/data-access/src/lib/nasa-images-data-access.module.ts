import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { NasaImagesEffects } from './+state/nasa-images.effects';
import { NasaImagesFacade } from './+state/nasa-images.facade';
import { nasaMediaReducer, NASA_IMAGES_FEATURE_KEY } from './+state/nasa-images.reducer';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(NASA_IMAGES_FEATURE_KEY, nasaMediaReducer), EffectsModule.forFeature([NasaImagesEffects])],
  providers: [NasaImagesFacade],
})
export class NasaImagesDataAccessModule {}
