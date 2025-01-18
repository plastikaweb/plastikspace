import { createFeature, createReducer, on } from '@ngrx/store';

import { layoutActions } from './layout.actions';

const LAYOUT_FEATURE_KEY = 'layout';

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

export const selectLayoutFeature = createFeature({
  name: LAYOUT_FEATURE_KEY,
  reducer: createReducer(
    initialState,
    on(
      layoutActions.setIsMobile,
      (state, { isMobile }): State => ({
        ...state,
        isMobile,
      })
    ),
    on(
      layoutActions.toggleSidenav,
      (state, { opened }): State => ({
        ...state,
        sidenavOpened: opened ?? !state.sidenavOpened,
      })
    )
  ),
});

export const { name, reducer, selectIsMobile, selectSidenavOpened } = selectLayoutFeature;
