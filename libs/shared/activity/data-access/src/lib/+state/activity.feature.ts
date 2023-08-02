import { createFeature, createReducer, on } from '@ngrx/store';

import { setActivity } from './activity.actions';

const ACTIVITY_FEATURE_KEY = 'activity';

export interface State {
  isActive: boolean;
}

export const initialState: State = {
  isActive: false,
};

export interface ActivityPartialState {
  readonly [ACTIVITY_FEATURE_KEY]: State;
}

const activityReducer = createReducer(
  initialState,
  on(setActivity, (state, { isActive }): State => ({ ...state, isActive })),
);

export const selectActivityFeature = createFeature({
  name: ACTIVITY_FEATURE_KEY,
  reducer: activityReducer,
});

export const { name, reducer, selectIsActive } = selectActivityFeature;
