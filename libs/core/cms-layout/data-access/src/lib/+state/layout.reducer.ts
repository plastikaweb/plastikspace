import { Action, createReducer, on } from '@ngrx/store';

import { setIsMobile, toggleSidenav } from './layout.actions';

export const LAYOUT_FEATURE_KEY = 'layout';

export interface State {
  isMobile: boolean;
  sidenavOpened: boolean;
}

export const initialState: State = {
  isMobile: false,
  sidenavOpened: true,
};

export interface LayoutPartialState {
  readonly [LAYOUT_FEATURE_KEY]: State;
}

const reducer = createReducer(
  initialState,
  on(
    setIsMobile,
    (state, { isMobile }): State => ({
      ...state,
      isMobile,
    }),
  ),
  on(
    toggleSidenav,
    (state, { opened }): State => ({
      ...state,
      sidenavOpened: opened ?? !state.sidenavOpened,
    }),
  ),
);

// eslint-disable-next-line jsdoc/require-jsdoc
export function layoutReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
