import { ActivityPartialState, initialState } from './activity.reducer';
import { selectActivityActive } from './activity.selectors';

describe('Activity Selectors', () => {
  let state: ActivityPartialState;

  beforeEach(() => {
    state = {
      activity: {
        ...initialState,
        active: true,
      },
    };
  });

  it('selectActivityActive should return the active property', () => {
    const result = selectActivityActive(state);

    expect(result).toBeTruthy();
  });
});
