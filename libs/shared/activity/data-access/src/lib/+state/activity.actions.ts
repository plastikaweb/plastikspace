import { createActionGroup, props } from '@ngrx/store';

export const activityActions = createActionGroup({
  source: 'Activity',
  events: {
    'Set Activity': props<{ isActive: boolean }>(),
  },
});
