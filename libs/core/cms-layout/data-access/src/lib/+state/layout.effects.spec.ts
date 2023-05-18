import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as LayoutActions from './layout.actions';
import { LayoutEffects } from './layout.effects';
import { LayoutPartialState } from './layout.reducer';
import { selectIsMobile, selectSidenavOpened } from './layout.selectors';

describe('LayoutEffects', () => {
  let actions: Observable<Action>;
  let effects: LayoutEffects;
  let metadata: EffectsMetadata<LayoutEffects>;
  let store: MockStore<unknown>;

  const initialState: LayoutPartialState = {
    layout: { isMobile: false, sidenavOpened: false },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LayoutEffects,
        provideMockActions(() => actions),
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectSidenavOpened, value: true },
            { selector: selectIsMobile, value: true },
          ],
        }),
      ],
    });

    effects = TestBed.inject(LayoutEffects);
    metadata = getEffectsMetadata(effects);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('routerRequest$', () => {
    it('should close sidenav if visible and if device is tablet or bigger', () => {
      const outcome = LayoutActions.toggleSidenav({ opened: false });

      actions = hot('-a', { a: { type: ROUTER_NAVIGATION } });
      const expected = cold('-b', { b: outcome });

      expect(effects.routerRequest$).toBeObservable(expected);
    });

    it('should not dispatch any action if device is not mobile', () => {
      store.overrideSelector(selectIsMobile, false);

      actions = hot('-a', { a: { type: ROUTER_NAVIGATION } });
      const expected = cold('', { b: [] });

      expect(effects.routerRequest$).toBeObservable(expected);
    });

    it('should not dispatch any action if sidebar is already closed', () => {
      store.overrideSelector(selectSidenavOpened, false);

      actions = hot('-a', { a: { type: ROUTER_NAVIGATION } });
      const expected = cold('', { b: [] });

      expect(effects.routerRequest$).toBeObservable(expected);
    });

    it('should register routerRequest$ that dispatches an action', () => {
      expect(metadata.routerRequest$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });
});
