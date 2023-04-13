import { createAction, props } from '@ngrx/store';
import { Notification } from '@plastik/core/notification/entities';

export const showNotification = createAction('[Notification] Show', props<{ configuration: Notification; preserve?: boolean }>());
export const hideNotification = createAction('[Notification] Hide');
