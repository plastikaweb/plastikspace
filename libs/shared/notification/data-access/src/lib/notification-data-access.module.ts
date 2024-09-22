import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationEffects } from './+state/notification.effects';
import { selectNotificationFeature } from './+state/notification.feature';

@NgModule({
  imports: [
    StoreModule.forFeature(selectNotificationFeature),
    EffectsModule.forFeature([NotificationEffects]),
  ],
})
export class NotificationDataAccessModule {}
