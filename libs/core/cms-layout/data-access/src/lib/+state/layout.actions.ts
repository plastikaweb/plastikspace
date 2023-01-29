import { createAction, props } from '@ngrx/store';

export const setIsMobile = createAction('[Screen] Set Is Mobile', props<{ isMobile: boolean }>());
export const toggleSidenav = createAction('[Sidenav] Toggle Sidenav', props<{ opened?: boolean }>());
