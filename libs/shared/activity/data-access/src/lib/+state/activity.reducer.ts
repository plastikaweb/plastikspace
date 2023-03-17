import { Action, createReducer, on } from '@ngrx/store';

import { setActivity } from './activity.actions';

export const ACTIVITY_FEATURE_KEY = 'activity';

export interface State {
  active: boolean;
}

export interface ActivityPartialState {
  readonly [ACTIVITY_FEATURE_KEY]: State;
}

export const initialState: State = {
  active: false,
};

const reducer = createReducer(
  initialState,
  on(setActivity, (state, { active }): State => ({ ...state, active })),
);

// eslint-disable-next-line jsdoc/require-jsdoc
export function activityReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
