import { Action } from '@ngrx/store';

import { setIsMobile, toggleSidenav } from './layout.actions';
import { initialState, layoutReducer } from './layout.reducer';

describe('Layout Reducer', () => {
  describe('valid Layout actions', () => {
    it('setIsMobile should return the state with passed value', () => {
      const newState = layoutReducer(initialState, setIsMobile({ isMobile: true }));
      expect(newState.isMobile).toBeTruthy();
    });

    it('toggleSidenav should toggle sidenavOpened property with no payload', () => {
      const newState = layoutReducer(initialState, toggleSidenav({}));
      expect(newState.sidenavOpened).toEqual(!initialState.sidenavOpened);
    });

    it('toggleSidenav should set sidenavOpened property with passed payload', () => {
      const newState = layoutReducer(initialState, toggleSidenav({ opened: true }));
      expect(newState.sidenavOpened).toBeTruthy();
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = layoutReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
