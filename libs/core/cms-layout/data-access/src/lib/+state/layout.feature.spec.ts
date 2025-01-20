import { Action } from '@ngrx/store';

import { layoutActions } from './layout.actions';
import {
  LayoutPartialState,
  initialState,
  name,
  reducer,
  selectIsMobile,
  selectSidenavOpened,
} from './layout.feature';

describe('Layout Reducer', () => {
  describe('valid Layout actions', () => {
    it('setIsMobile should return the state with passed value', () => {
      const newState = reducer(initialState, layoutActions.setIsMobile({ isMobile: true }));
      expect(newState.isMobile).toBeTruthy();
    });

    it('toggleSidenav should toggle sidenavOpened property with no payload', () => {
      const newState = reducer(initialState, layoutActions.toggleSidenav({}));
      expect(newState.sidenavOpened).toEqual(!initialState.sidenavOpened);
    });

    it('toggleSidenav should set sidenavOpened property with passed payload', () => {
      const newState = reducer(initialState, layoutActions.toggleSidenav({ opened: true }));
      expect(newState.sidenavOpened).toBeTruthy();
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});

describe('Layout Selectors', () => {
  let state: LayoutPartialState;

  beforeEach(() => {
    state = {
      [name]: {
        ...initialState,
        isMobile: true,
        sidenavOpened: true,
      },
    };
  });
  it('selectIsMobile should return isMobile property value', () => {
    expect(selectIsMobile.projector(state[name])).toBeTruthy();
  });

  it('selectSidenavOpened should return opened property value', () => {
    expect(selectSidenavOpened.projector(state[name])).toBeTruthy();
  });
});
