import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { ACTIVITY_FEATURE_KEY, activityReducer } from './+state/activity.reducer';

@NgModule({
  imports: [StoreModule.forFeature(ACTIVITY_FEATURE_KEY, activityReducer)],
})
export class SharedActivityDataAccessModule {}
