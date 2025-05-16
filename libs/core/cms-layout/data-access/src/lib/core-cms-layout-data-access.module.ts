import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LayoutEffects } from './+state/layout.effects';
import { selectLayoutFeature } from './+state/layout.feature';

@NgModule({
  imports: [StoreModule.forFeature(selectLayoutFeature), EffectsModule.forFeature([LayoutEffects])],
})
export class CoreCmsLayoutDataAccessModule {}
