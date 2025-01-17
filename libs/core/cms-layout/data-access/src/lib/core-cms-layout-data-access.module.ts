import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedActivityDataAccessModule } from '@plastik/shared/activity/data-access';

import { LayoutEffects } from './+state/layout.effects';
import { selectLayoutFeature } from './+state/layout.feature';

@NgModule({
  imports: [
    StoreModule.forFeature(selectLayoutFeature),
    EffectsModule.forFeature([LayoutEffects]),
    SharedActivityDataAccessModule,
  ],
})
export class CoreCmsLayoutDataAccessModule {}
