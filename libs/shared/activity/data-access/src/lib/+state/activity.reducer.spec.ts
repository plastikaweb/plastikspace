import { Action } from '@ngrx/store';

import { setActivity } from './activity.actions';
import { activityReducer, initialState, State } from './activity.reducer';

describe('Activity Reducer', () => {
  describe('valid Activity actions', () => {
    it('setActivity should return active value', () => {
      const active = false;
      const action = setActivity({ active });

      const result: State = activityReducer(initialState, action);

      expect(result.active).toBeFalsy();
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = activityReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
