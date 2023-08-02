import { createAction, props } from '@ngrx/store';

export const setActivity = createAction('[Activity] Set Activity', props<{ isActive: boolean }>());
