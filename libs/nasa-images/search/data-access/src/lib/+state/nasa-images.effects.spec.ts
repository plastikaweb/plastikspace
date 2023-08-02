import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { getMockedRouterNavigation, selectRouteDataName, selectRouteQueryParams } from '@plastik/core/router-state';
import { selectIsActive, setActivity } from '@plastik/shared/activity/data-access';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';

import { showNotification } from '@plastik/core/notification/data-access';
import { NasaImagesApiService } from '../nasa-images-api.service';
import { createDummyNasaImagesSearch } from '../nasa-images.mock';
import { nasaImagesAPIActions, nasaImagesPageActions } from './nasa-images.actions';
import { NasaImagesEffects } from './nasa-images.effects';

describe('NasaImagesEffects', () => {
  const { items, count } = createDummyNasaImagesSearch();
  const ERROR_MSG = 'Error occurred.';

  let actions: Observable<Action>;
  let effects: NasaImagesEffects;
  let metadata: EffectsMetadata<NasaImagesEffects>;
  let service: NasaImagesApiService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NasaImagesEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            { selector: selectRouteDataName, value: 'search' },
            {
              selector: selectRouteQueryParams,
              value: { q: 'pluto', media_type: 'image' },
            },
            {
              selector: selectIsActive,
              value: false,
            },
          ],
        }),
        provideEnvironmentMock(),
        {
          provide: NasaImagesApiService,
          useValue: {
            getList: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(NasaImagesEffects);
    service = TestBed.inject(NasaImagesApiService);
    store = TestBed.inject(MockStore);

    metadata = getEffectsMetadata(effects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('navigation$', () => {
    let action = getMockedRouterNavigation('/search?q=pluto');
    it('should dispatch loadNasaImages with queryParams if /search route is found and "q" search value is not empty', () => {
      actions = hot('-a', { a: action });
      const expected = cold('-b', { b: nasaImagesPageActions.load({ params: { q: 'pluto', media_type: 'image' } }) });

      expect(effects.navigation$).toBeObservable(expected);
    });

    it('should dispatch cleanupNasaImages if /search route is found and "q" search value is empty', () => {
      store.overrideSelector(selectRouteQueryParams, { q: '', media_type: 'image' });

      action = getMockedRouterNavigation('/search?q=');
      actions = hot('-a', { a: action });
      const expected = cold('-b', { b: nasaImagesPageActions.cleanUp() });

      expect(effects.navigation$).toBeObservable(expected);
    });

    it('should not dispatch loadNasaImages with queryParams if no /search route is found', () => {
      store.overrideSelector(selectRouteDataName, 'faqs');

      actions = hot('-a', { a: action });
      const expected = cold('', { b: [] });

      expect(effects.navigation$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.navigation$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('load$', () => {
    const action = nasaImagesPageActions.load({ params: { q: 'pluto', media_type: 'image' } });
    it('should work on success', () => {
      jest.spyOn(service, 'getList').mockImplementation(() => of({ items, count }));
      actions = hot('-a-|', { a: action });
      const expected = hot('-a-|', { a: nasaImagesAPIActions.loadSuccess({ items, count }) });

      expect(effects.load$).toBeObservable(expected);
    });

    it('should work on failure', () => {
      jest.spyOn(service, 'getList').mockImplementation(() => throwError(() => ({ reason: ERROR_MSG })));
      actions = hot('-a-#', { a: action });
      const expected = cold('-b-#', { b: nasaImagesAPIActions.loadFailure({ error: ERROR_MSG }) });

      expect(effects.load$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.load$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('activeOn$', () => {
    const action = nasaImagesPageActions.load({ params: { q: 'pluto' } });
    it('should work', () => {
      actions = hot('-a-|', { a: action });
      const expected = hot('-a-|', { a: setActivity({ isActive: true }) });

      expect(effects.activeOn$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.activeOn$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('loadSuccess$', () => {
    it('should be registered', () => {
      expect(metadata.loadSuccess$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('activeOff$', () => {
    const action = nasaImagesAPIActions.loadSuccess({ items, count });
    it('should work', () => {
      actions = hot('-a-|', { a: action });
      const expected = hot('-a-|', { a: setActivity({ isActive: false }) });

      expect(effects.activeOff$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.activeOff$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('showNotification$', () => {
    it('should return showNotification action on loadNasaImagesFailure', () => {
      const action = nasaImagesAPIActions.loadFailure({ error: ERROR_MSG });
      const outcome = showNotification({
        configuration: {
          type: 'ERROR',
          icon: 'cancel',
          action: 'close',
          ariaLabel: 'Close error notification',
          message: `<span class="sr-only">Error: </span>${ERROR_MSG}`,
        },
      });
      actions = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.showNotification$).toBeObservable(expected);
    });

    it('should register showNotification$ that dispatches an action', () => {
      expect(metadata.showNotification$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });
});
