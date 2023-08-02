import { createActionGroup, props } from '@ngrx/store';

export const layoutActions = createActionGroup({
  source: '[Layout]',
  events: {
    'Set Is Mobile': props<{ isMobile: boolean }>(),
    'Toggle Sidenav': props<{ opened?: boolean }>(),
  },
});
