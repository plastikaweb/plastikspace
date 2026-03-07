import { beforeEach, describe, expect, it, vi } from 'vitest';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DataGetList } from '@plastik/core/api-base';
import { provideEnvironmentWithApiMock } from '@plastik/core/environments/testing';
import {
  getMockedRouterNavigation,
  selectRouteDataName,
  selectRouteQueryParams,
} from '@plastik/core/router-state';
import { activityStore } from '@plastik/shared/activity/data-access';
import { notificationStore } from '@plastik/shared/notification/data-access';

import {
  NasaImage,
  NasaImagesSearch,
  NasaImagesSearchApiParams,
} from '@plastik/nasa-images/search/entities';
import { createDummyNasaImagesSearch } from '../nasa-images.mock';
import { NASA_IMAGES_DATA_LIST_TOKEN } from '../nasa-images.tokens';
import { nasaImagesAPIActions, nasaImagesPageActions } from './nasa-images.actions';
import { NasaImagesEffects } from './nasa-images.effects';

describe('NasaImagesEffects', () => {
  const { items, count } = createDummyNasaImagesSearch();
  const ERROR_MSG = 'Error occurred.';

  let actions: Observable<Action>;
  let effects: NasaImagesEffects;
  let metadata: EffectsMetadata<NasaImagesEffects>;
  let dataService: DataGetList<NasaImage, NasaImagesSearch, NasaImagesSearchApiParams>;
  let activityStoreInstance: any;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        NasaImagesEffects,
        notificationStore,
        activityStore,
        provideHttpClientTesting(),
        provideMockActions(() => actions),
        provideMockStore({
          initialState: {
            ['activity']: {
              isActive: false,
            },
          },
          selectors: [
            { selector: selectRouteDataName, value: 'search' },
            {
              selector: selectRouteQueryParams,
              value: { q: 'pluto', media_type: 'image' },
            },
          ],
        }),
        provideEnvironmentWithApiMock(),
        {
          provide: NASA_IMAGES_DATA_LIST_TOKEN,
          useValue: {
            getList: vi.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(NasaImagesEffects);
    metadata = getEffectsMetadata(effects);
    dataService = TestBed.inject(NASA_IMAGES_DATA_LIST_TOKEN) as DataGetList<
      NasaImage,
      NasaImagesSearch,
      NasaImagesSearchApiParams
    >;
    activityStoreInstance = TestBed.inject(activityStore);
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
      const expected = cold('-b', {
        b: nasaImagesPageActions.load({ params: { q: 'pluto', media_type: 'image' } }),
      });

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
      vi.spyOn(dataService, 'getList').mockImplementation(() => of({ items, count }));
      actions = hot('-a-|', { a: action });
      const expected = hot('-a-|', { a: nasaImagesAPIActions.loadSuccess({ items, count }) });

      expect(effects.load$).toBeObservable(expected);
    });

    it('should work on failure', () => {
      vi.spyOn(dataService, 'getList').mockImplementation(() =>
        throwError(() => ({ reason: ERROR_MSG }))
      );
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
      // Mock para verificar que se llama a setActivity
      const mockAction = { type: '[Activity] Set Activity True' };
      vi.spyOn(activityStoreInstance, 'setActivity').mockImplementation(() => mockAction);
      const expected = hot('-a-|', { a: mockAction });

      expect(effects.activeOn$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.activeOn$).toEqual({
        dispatch: false,
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
      // Mock para verificar que se llama a setActivity
      const mockAction = { type: '[Activity] Set Activity False' };
      vi.spyOn(activityStoreInstance, 'setActivity').mockReturnValue(mockAction);
      const expected = hot('-a-|', { a: mockAction });

      expect(effects.activeOff$).toBeObservable(expected);
    });

    it('should be registered', () => {
      expect(metadata.activeOff$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
  });

  // describe('showNotification$', () => {
  //   it('should return showNotification action on loadNasaImagesFailure', () => {
  //     const action = nasaImagesAPIActions.loadFailure({ error: ERROR_MSG });
  //     const outcome = notificationStore.show({
  //       configuration: {
  //         type: 'ERROR',
  //         icon: 'cancel',
  //         action: 'close',
  //         ariaLabel: 'Close error notification',
  //         message: `<span class="sr-only">Error: </span>${ERROR_MSG}`,
  //       },
  //     });
  //     actions = hot('-a', { a: action });
  //     const expected = cold('-b', { b: outcome });

  //     expect(effects.showNotification$).toBeObservable(expected);
  //   });

  //   it('should register showNotification$ that dispatches an action', () => {
  //     expect(metadata.showNotification$).toEqual({
  //       dispatch: true,
  //       useEffectsErrorHandler: true,
  //     });
  //   });
  // });
});
