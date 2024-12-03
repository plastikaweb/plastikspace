import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { provideRouter } from '@angular/router';
import { notificationActions } from './notification.actions';
import { NotificationEffects } from './notification.effects';
import { selectConfiguration, selectPreserveOnRouteRequest } from './notification.feature';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getMockedRouterRequest } from '@plastik/core/router-state';

describe('NotificationEffects Effects', () => {
  let actions$: Observable<Action>;
  let effects: NotificationEffects;
  let metadata: EffectsMetadata<NotificationEffects>;
  let store: MockStore<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationEffects,
        provideRouter([]),
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectConfiguration,
              value: {
                message: 'message',
                type: 'ERROR',
              },
            },
          ],
        }),
      ],
    });

    effects = TestBed.inject(NotificationEffects);
    metadata = getEffectsMetadata(effects);
    store = TestBed.inject(MockStore);
  });

  describe('dismissNotification$', () => {
    it('should return an dismissNotification action', () => {
      store.overrideSelector(selectPreserveOnRouteRequest, false);

      actions$ = hot('-a', {
        a: getMockedRouterRequest('/test'),
      });
      const outcome = notificationActions.dismiss();
      const expected = cold('-b', { b: outcome });

      expect(effects.dismissNotification$).toBeObservable(expected);
    });

    it('should not return a dismissNotification action if preserveOnRouteRequest is true', () => {
      store.overrideSelector(selectPreserveOnRouteRequest, true);

      actions$ = hot('-a', {
        a: getMockedRouterRequest('/test'),
      });
      const expected = cold('', { b: [] });

      expect(effects.dismissNotification$).toBeObservable(expected);
    });

    it('should not return a dismissNotification action if no configuration is set', () => {
      store.overrideSelector(selectConfiguration, null);

      actions$ = hot('-a', {
        a: getMockedRouterRequest('/test'),
      });
      const expected = cold('', { b: [] });

      expect(effects.dismissNotification$).toBeObservable(expected);
    });

    it('should register dismissNotification$ that dispatches an action', () => {
      expect(metadata.dismissNotification$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });
});
