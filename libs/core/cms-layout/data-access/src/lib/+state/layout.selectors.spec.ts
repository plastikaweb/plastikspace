import { initialState, LAYOUT_FEATURE_KEY, LayoutPartialState } from './layout.reducer';
import { selectIsMobile, selectSidenavOpened } from './layout.selectors';

describe('Layout Selectors', () => {
  let state: LayoutPartialState;

  beforeEach(() => {
    state = {
      [LAYOUT_FEATURE_KEY]: {
        ...initialState,
        isMobile: true,
        sidenavOpened: true,
      },
    };
  });
  it('selectIsMobile should return isMobile property value', () => {
    expect(selectIsMobile.projector(state[LAYOUT_FEATURE_KEY])).toBeTruthy();
  });

  it('selectSidenavOpened should return opened property value', () => {
    expect(selectSidenavOpened.projector(state[LAYOUT_FEATURE_KEY])).toBeTruthy();
  });
});
