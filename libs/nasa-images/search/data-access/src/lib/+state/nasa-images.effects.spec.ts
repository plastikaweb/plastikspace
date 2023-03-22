import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { getMockedRouterNavigation, selectRouteDataName, selectRouteQueryParams } from '@plastik/core/router-state';
import { NasaImagesViews } from '@plastik/nasa-images/search/entities';
import { selectActivityActive, setActivity } from '@plastik/shared/activity/data-access';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';

import { NasaImagesApiService } from '../nasa-images-api.service';
import { createDummyNasaImagesSearch } from '../nasa-images.mock';
import * as NasaImagesActions from './nasa-images.actions';
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
            { selector: selectRouteDataName, value: NasaImagesViews.SEARCH },
            {
              selector: selectRouteQueryParams,
              value: { q: 'pluto', media_type: 'image' },
            },
            {
              selector: selectActivityActive,
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
    const action = getMockedRouterNavigation('/search?q=pluto');
    it('should dispatch loadNasaImages with queryParams if /search route is found', () => {
      actions = hot('-a', { a: action });
      const expected = cold('-b', { b: NasaImagesActions.loadNasaImages({ params: { q: 'pluto', media_type: 'image' } }) });

      expect(effects.navigation$).toBeObservable(expected);
    });

    it('should not dispatch loadNasaImages with queryParams if no /search route is found', () => {
      store.overrideSelector(selectRouteDataName, NasaImagesViews.EXPLANATION);

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
    const action = NasaImagesActions.loadNasaImages({ params: { q: 'pluto', media_type: 'image' } });
    it('should work on success', () => {
      jest.spyOn(service, 'getList').mockImplementation(() => of({ items, count }));
      actions = hot('-a-|', { a: action });
      const expected = hot('-a-|', { a: NasaImagesActions.loadNasaImagesSuccess({ items, count }) });

      expect(effects.load$).toBeObservable(expected);
    });

    it('should work on failure', () => {
      jest.spyOn(service, 'getList').mockImplementation(() => throwError(() => ({ reason: ERROR_MSG })));
      actions = hot('-a-#', { a: action });
      const expected = cold('-b-#', { b: NasaImagesActions.loadNasaImagesFailure({ error: ERROR_MSG }) });

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
    const action = NasaImagesActions.loadNasaImages({ params: { q: 'pluto' } });
    it('should work', () => {
      actions = hot('-a-|', { a: action });
      const expected = hot('-a-|', { a: setActivity({ active: true }) });

      expect(effects.activeOn$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.activeOn$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('activeOff$', () => {
    const action = NasaImagesActions.loadNasaImagesSuccess({ items, count });
    it('should work', () => {
      actions = hot('-a-|', { a: action });
      const expected = hot('-a-|', { a: setActivity({ active: false }) });

      expect(effects.activeOff$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.activeOff$).toEqual({
        dispatch: true,
        useEffectsErrorHandler: true,
      });
    });
  });
});
