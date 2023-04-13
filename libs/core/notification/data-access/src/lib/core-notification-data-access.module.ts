import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationEffects } from './+state/notification.effects';
import { NOTIFICATION_FEATURE_KEY, notificationReducer } from './+state/notification.reducer';

@NgModule({
  imports: [StoreModule.forFeature(NOTIFICATION_FEATURE_KEY, notificationReducer), EffectsModule.forFeature([NotificationEffects])],
})
export class CoreNotificationDataAccessModule {}
