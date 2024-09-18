import { Action } from '@ngrx/store';

import { activityActions } from './activity.actions';
import {
  ActivityPartialState,
  initialState,
  reducer,
  selectIsActive,
  State,
} from './activity.feature';

describe('Activity Reducer', () => {
  describe('valid Activity actions', () => {
    it('setActivity should return active value', () => {
      const isActive = false;
      const action = activityActions.setActivity({ isActive });

      const result: State = reducer(initialState, action);

      expect(result.isActive).toBeFalsy();
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

describe('Activity Selectors', () => {
  let state: ActivityPartialState;

  beforeEach(() => {
    state = {
      activity: {
        ...initialState,
        isActive: true,
      },
    };
  });

  it('selectActivityActive should return the active property', () => {
    const result = selectIsActive(state);

    expect(result).toBeTruthy();
  });
});
