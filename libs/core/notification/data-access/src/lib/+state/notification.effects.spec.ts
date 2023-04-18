import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getMockedRouterRequest } from '@plastik/core/router-state';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { dismissNotification } from './notification.actions';
import { NotificationEffects } from './notification.effects';
import { selectNotificationPreserveOnRouteRequest } from './notification.selectors';

describe('NotificationEffects Effects', () => {
  let actions$: Observable<Action>;
  let effects: NotificationEffects;
  let metadata: EffectsMetadata<NotificationEffects>;
  let store: MockStore<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        NotificationEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [{ selector: selectNotificationPreserveOnRouteRequest, value: false }],
        }),
      ],
    });

    effects = TestBed.inject(NotificationEffects);
    metadata = getEffectsMetadata(effects);
    store = TestBed.inject(MockStore);
  });

  describe('dismissNotification$', () => {
    it('should return an dismissNotification action', () => {
      actions$ = hot('-a', {
        a: getMockedRouterRequest('/test'),
      });
      const outcome = dismissNotification();
      const expected = cold('-b', { b: outcome });

      expect(effects.dismissNotification$).toBeObservable(expected);
    });

    it('should not return an dismissNotification action', () => {
      store.overrideSelector(selectNotificationPreserveOnRouteRequest, true);

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
