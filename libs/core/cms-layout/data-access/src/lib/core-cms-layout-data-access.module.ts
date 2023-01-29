import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LayoutEffects } from './+state/layout.effects';
import { layoutReducer, LAYOUT_FEATURE_KEY } from './+state/layout.reducer';

@NgModule({
  imports: [StoreModule.forFeature(LAYOUT_FEATURE_KEY, layoutReducer), EffectsModule.forFeature([LayoutEffects])],
})
export class CoreCmsLayoutDataAccessModule {}
