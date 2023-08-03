import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { selectActivityFeature } from './+state/activity.feature';

@NgModule({
  imports: [StoreModule.forFeature(selectActivityFeature)],
})
export class SharedActivityDataAccessModule {}
